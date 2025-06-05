import time
import json
from .execution_runtime import LocalRuntime

class SimulationSandbox:
    def __init__(self, agent_builder, runtime=None):
        self.agent_builder = agent_builder
        self.runtime = runtime or LocalRuntime()
        self.simulation_logs = []

    def run_battle(self, agent_id_a, agent_id_b, task_description):
        """
        Runs two agents against the same task and compares outputs.
        """
        print(f"--- Starting Simulation Battle: {agent_id_a} vs {agent_id_b} ---")
        
        start_a = time.time()
        result_a = self.runtime.run_task(agent_id_a, task_description)
        latency_a = time.time() - start_a

        start_b = time.time()
        result_b = self.runtime.run_task(agent_id_b, task_description)
        latency_b = time.time() - start_b

        comparison = {
            "task": task_description,
            "agent_a": {"id": agent_id_a, "latency": latency_a, "result": result_a},
            "agent_b": {"id": agent_id_b, "latency": latency_b, "result": result_b},
            "timestamp": time.time()
        }
        
        self.simulation_logs.append(comparison)
        return comparison

    def run_collaboration(self, agent_ids, objective):
        """
        Simulates multiple agents working sequentially on a complex objective.
        """
        print(f"--- Starting Collaborative Simulation with {len(agent_ids)} agents ---")
        context = ""
        steps = []

        for agent_id in agent_ids:
            task = f"Current State: {context}. Objective: {objective}"
            result = self.runtime.run_task(agent_id, task)
            context = result.get('output', "")
            steps.append({"agent": agent_id, "output": context})

        return {"objective": objective, "steps": steps}

    def save_results(self, filepath):
        with open(filepath, 'w') as f:
            json.dump(self.simulation_logs, f, indent=2)
