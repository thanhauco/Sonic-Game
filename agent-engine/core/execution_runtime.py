import abc

class ExecutionRuntime(abc.ABC):
    @abc.abstractmethod
    def run_task(self, agent_id, task_description):
        pass

class LocalRuntime(ExecutionRuntime):
    def run_task(self, agent_id, task_description):
        print(f"Agent {agent_id} is executing task: {task_description}")
        return {
            "status": "success",
            "output": f"Refined output for: {task_description}",
            "agent": agent_id
        }

class DockerRuntime(ExecutionRuntime):
    def run_task(self, agent_id, task_description):
        # Implementation for containerized execution
        print(f"Launching docker container for agent {agent_id}")
        return {"status": "success", "output": "Isolated execution result"}
