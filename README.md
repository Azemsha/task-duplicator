This extension is used to export issues from one Jira Board to another.

### Preparation to work

1) Open extension setting.
2) Provide Login, Password and Jira link, where the issues will be exported.
3) Provide Project Key in that Jira, which will be used for task creation.
4) Select the default mode for the extension popup:
        
    - 'Separate Task' mode - this mode is used when you are want to clone the issue.
    - 'Development/Meeting' mode - this mode is using when you are have only two tasks 
    (Development and Meetings) in your 'internal' Jira.
    
5) Provide names of Assignees, if you will use the extension for creation task for another team members.
6) Provide Development and Meetings Issue Numbers from 'internal' Jira. 
It can be just issue number, or number with the Project Key (eg. '1234' or 'PROJECT-1234').


### Work with Development/Meeting Mode

1) Open 'External' Jira.
2) Open issue which you were working on.
3) Open Extension.
4) Select the date for a log.
5) Fill hours to log in Development task.
6) Click 'LOG' Button. If log add sucsess you will see the message at the bottom about that.
    
    - Sample log message: 'KEY-1234: [ISSUE_SUMMARY];

7) To log in Meeting task select date and fill hours to log and click on 'LOG' button.
For Meeting issue log comment will be empty.


