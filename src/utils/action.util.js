function taskUtils() {
    this.getBody = function (taskNumber, summary, description, assignee, projectKey, billable) {
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
                    value: billable ? "Billable" : "Non-Billable"
                }
            }
        };
    };

    return this;
}

const TASK_UTILS = taskUtils();