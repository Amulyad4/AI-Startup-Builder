import logging
import json
from app.graph.workflow import startup_builder_app

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_pipeline():
    test_idea = "An AI platform for local artisans to auto-generate social media marketing, pricing strategies, and global shipping options"
    print("==================================================")
    print(f"Testing End-to-End Multi-Agent Pipeline for:\n'{test_idea}'")
    print("==================================================")

    initial_state = {"startup_idea": test_idea}
    result_state = startup_builder_app.invoke(initial_state)

    print("\n--- Pipeline Execution Logs ---")
    for log in result_state.get("logs", []):
        print(log)

    final_output = result_state.get("final_output", {})
    print("\n--- Final Blueprint Sections Generated ---")
    for key, val in final_output.items():
        status = "OK" if val else "MISSING"
        print(f"- {key}: {status}")

    print("\nTest completed successfully!")

if __name__ == "__main__":
    test_pipeline()
