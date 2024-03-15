import pandas as pd
import os
import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, PeftModel, prepare_model_for_kbit_training, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    HfArgumentParser,
    TrainingArguments,
    pipeline,
    logging,
)
from peft import LoraConfig, PeftModel
from trl import SFTTrainer
from datasets import Dataset
import sys


def convert_to_format(row):
    sentence = row['sentence']
    word = row['token']
    complexity = row['complexity']

    prompt = "Below is an instruction that describes a task paired with input that provides further context. Write a response that appropriately completes the request."

    instruction = "Given the following sentence, your job is to calculate the complexity of the word in the given sentence, where the complexity score ranges from 0 to 1"

    input_format = f"sentence: {sentence}\nword: {word}"

    response = str(complexity)

    if len(input_format.strip()) == 0:
        text = prompt + "\n\n### Instruction:\n" + instruction + "\n### Response:\n" + response
    else:
        text = prompt + "\n\n### Instruction:\n" + instruction + "\n### Input:\n" + input_format + "\n\n### Response:\n" + response

    # Return a pandas Series with the formatted strings
    return pd.Series([instruction, input_format, response, text])


def train_mistral_7b(output_dir, dataset_dir):
    df = pd.read_csv(dataset_dir)

    # Apply the conversion to each row and rename columns directly
    new_df = df.apply(convert_to_format, axis=1)
    new_df.columns = ['instruction', 'input', 'output', 'text']

    processed_data_csv = os.path.join(output_dir, "processed_data.csv")
    new_df.to_csv(processed_data_csv, index=False)

    # Load the processed data as Huggin Face Dataset
    dataset = Dataset.from_pandas(new_df)

    # Configuration and model preparation
    model_id = "mistralai/Mistral-7B-v0.1"
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16
    )

    device = "cuda" if torch.cuda.is_available() else "cpu"

    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb_config,
        device_map={device: 0}
    )

    model = prepare_model_for_kbit_training(model)
    model.config.use_cache = False # silence the warnings. Please re-enable for inference!
    model.config.pretraining_tp = 1

    # Load LLaMA tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.add_eos_token = True
    tokenizer.add_bos_token, tokenizer.add_eos_token

    # Load LoRA configuration
    peft_config = LoraConfig(
        r=32,
        lora_alpha=64,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj","gate_proj", "up_proj"],
        bias="none",
        lora_dropout=0.05,  # Conventional
        task_type="CAUSAL_LM",
    )

    if torch.cuda.device_count() > 1: # If more than 1 GPU
        model.is_parallelizable = True
        model.model_parallel = True

    # Training configurations...
    run_name = "mistral-7b-finetune-mlsp-2024"
    training_arguments = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=1,
        per_device_train_batch_size=4,  # Adjust based on your GPU memory
        gradient_accumulation_steps=1,
        optim="adamw_torch",
        save_steps=50,
        logging_steps=50,
        learning_rate=1e-5,
        weight_decay=0.01,
        fp16=True,
        evaluation_strategy="steps",
        push_to_hub=False,
        log_level="error",
        run_name=f"{model_id}-{datetime.now().strftime('%Y-%m-%d-%H-%M')}",
        report_to="none"  # Disable WANDB
    )

     # Trainer setup...
    trainer = Trainer(
        model=model,
        args=training_arguments,
        train_dataset=dataset,
        tokenizer=tokenizer,
    )

    # Check for last checkpoint...
    last_checkpoint = get_last_checkpoint(training_arguments.output_dir)
    if last_checkpoint is not None:
        checkpoint = last_checkpoint
    else:
        checkpoint = None

    trainer.train(resume_from_checkpoint=checkpoint)
    model.save_pretrained(output_dir)


if __main__ == "__main__"
    if len(sys.argv) == 3:
        output_dir = sys.argv[1]
        dataset_dir = sys.argv[2]
        
        # Now you can use the variables in your function calls
        train_mistral_7b(output_dir, dataset_dir)
    else:
        print("Usage: script.py output_dir dataset_dir")
        sys.exit(1)


