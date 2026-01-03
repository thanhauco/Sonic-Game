import json

class WorkflowEngine:
    def __init__(self, execution_runtime):
        self.runtime = execution_runtime
        self.workflows = {}

    def create_workflow(self, name, steps):
        """
        Steps is a list of tasks with agent assignments.
        E.g. [{"agent": "researcher", "task": "find news"}, {"agent": "writer", "task": "summarize"}]
        """
        workflow_id = name.lower().replace(" ", "-")
        self.workflows[workflow_id] = {
            "name": name,
            "steps": steps,
            "status": "idle"
        }
        return workflow_id

    def execute_workflow(self, workflow_id):
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            raise ValueError("Workflow not found")

        results = []
        for step in workflow["steps"]:
            print(f"Executing step: {step['task']} with agent {step['agent']}")
            result = self.runtime.run_task(step['agent'], step['task'])
            results.append(result)
        
        return results

if __name__ == "__main__":
    from execution_runtime import LocalRuntime
    engine = WorkflowEngine(LocalRuntime())
    wf_id = engine.create_workflow("Research & Write", [
        {"agent": "res-1", "task": "Search for latest AI news"},
        {"agent": "writer-1", "task": "Summarize the findings"}
    ])
    print(engine.execute_workflow(wf_id))
