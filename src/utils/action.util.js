function taskUtils() {
    this.getBody = function (taskNumber, summary, description, assignee, projectKey) {
        return {
            fields: {
                project:
                    {
                        key: projectKey
                    },
                summary: taskNumber + ": " + summary,
                description: description,
                issuetype: {
                    name: "Task"
                },
                assignee: {
                    name: assignee
                },
                "customfield_19870": {
                    value: "Billable"
                }
            }
        };
    };

    return this;
}

const TASK_UTILS = taskUtils();