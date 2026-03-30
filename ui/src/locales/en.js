export default {
    // ─── Common / Shared ───────────────────────────────────────────────
    common: {
        refresh: 'Refresh',
        submit: 'Submit',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
        cancel: 'Cancel',
        confirm: 'Confirm',
        actions: 'Actions',
        columns: 'Columns',
        name: 'Name',
        email: 'Email',
        enabled: 'Enabled',
        na: 'N/A',
        anonymous: 'Anonymous',
        unmanaged: 'Unmanaged',
        required: 'Required'
    },

    // ─── Toast Messages ────────────────────────────────────────────────
    toast: {
        refreshedSuccessfully: 'Refreshed successfully!',
        createdSuccessfully: 'Created successfully!',
        updatedSuccessfully: 'Updated successfully!',
        deletedSuccessfully: 'Deleted successfully!',
        copiedSuccessfully: 'Copied successfully!',
        sentSuccessfully: 'Sent successfully!',
        downloadedSuccessfully: 'Downloaded successfully!',
        restoredSuccessfully: 'Restored successfully!',
        uploadedSuccessfully: 'Uploaded successfully!',
        cleanedUpSuccessfully: 'Cleaned up successfully!',
        vacuumedSuccessfully: 'Vacuumed successfully!',
        managedSuccessfully: 'Managed successfully!',
        restartedSuccessfully: 'Restarted successfully!',
        reloadedSuccessfully: 'Reloaded successfully!',
        stoppedSuccessfully: 'Stopped successfully!',
        startedSuccessfully: 'Started successfully!',
        duplicatedSuccessfully: 'Duplicated successfully!'
    },

    // ─── Error / Auth Messages ─────────────────────────────────────────
    error: {
        sessionExpired: 'Session expired.',
        sessionExpiredDescription:
            'Your session has expired. Please log in again.',
        error: 'Error.',
        anErrorOccurred: 'An error occurred.',
        invalidCredentials: 'Invalid credentials.',
        invalidCredentialsDescription:
            'The credentials you entered are invalid.'
    },

    // ─── Login Page ────────────────────────────────────────────────────
    login: {
        title: 'Login',
        description: 'Enter your credentials to access your dashboard.',
        email: 'Email',
        password: 'Password',
        welcomeDescription:
            "Welcome! You've logged in successfully. You can now manage your processes."
    },

    // ─── Dashboard / Navigation ────────────────────────────────────────
    dashboard: {
        appName: 'PM2 UI',
        goTo: 'Go to ...',
        nav: {
            home: 'Home',
            management: 'Management',
            logs: 'Logs',
            metric: 'Metric',
            communication: 'Communication',
            deployment: 'Deployment',
            action: 'Action',
            backup: 'Backup',
            settings: 'Settings',
            general: 'General',
            security: 'Security',
            database: 'Database',
            administration: 'Administration',
            adminLog: 'Admin Log',
            user: 'User'
        }
    },

    // ─── User Menu ─────────────────────────────────────────────────────
    userMenu: {
        theme: 'Theme',
        appearance: 'Appearance',
        light: 'Light',
        dark: 'Dark',
        logOut: 'Log out',
        language: 'Language'
    },

    // ─── Stats ─────────────────────────────────────────────────────────
    stats: {
        totalCount: 'Total Count',
        runningCount: 'Running Count',
        stoppedCount: 'Stopped Count',
        totalRestartCount: 'Total Restart Count'
    },

    // ─── Process List ──────────────────────────────────────────────────
    processList: {
        filterName: 'Filter name...',
        id: '#',
        name: 'Name',
        script: 'Script',
        status: 'Status',
        mode: 'Mode',
        restartCount: 'Restart Count',
        runPeriod: 'Run Period',
        cpu: 'CPU',
        memory: 'Memory',
        createdBy: 'Created By',
        createTime: 'Create Time',
        start: 'Start',
        restart: 'Restart',
        reload: 'Reload',
        stop: 'Stop',
        delete: 'Delete',
        editConfigurations: 'Edit configurations',
        manageConfiguration: 'Manage configuration',
        viewDescription: 'View description',
        copyConfigurationAsJson: 'Copy configuration as JSON',
        duplicateConfiguration: 'Duplicate configuration',
        restartRequired: 'Restart required'
    },

    // ─── Action Page ───────────────────────────────────────────────────
    action: {
        tabs: {
            process: 'Process',
            startup: 'Startup',
            persist: 'Persist',
            global: 'Global'
        },
        resetProcessRestartCounter: 'Reset process restart counter',
        reset: 'Reset',
        clearLogFile: 'Clear log file',
        clear: 'Clear',
        generateStartupScript: 'Generate startup script',
        startup: 'Startup',
        generateUnstartupScript: 'Generate unstartup script',
        unstartup: 'Unstartup',
        saveProcesses: 'Save processes',
        save: 'Save',
        resurrectProcesses: 'Resurrect processes',
        resurrect: 'Resurrect',
        processesResurrectedWillBeUnmanaged:
            'Processes resurrected will be unmanaged',
        updateTheInMemoryPm2Daemon: 'Update the in-memory PM2 daemon',
        killThePm2Daemon: 'Kill the PM2 daemon',
        kill: 'Kill',
        killWarning:
            'All functionalities will not work and all PM2 processes will be deleted after this action',
        pingOrDaemonizedPm2: 'Ping or daemonized PM2',
        ping: 'Ping',
        pingOrStartThePm2Daemon: 'Ping or start the PM2 daemon',
        killTheDaemon: 'Kill the daemon'
    },

    // ─── Admin Log Page ────────────────────────────────────────────────
    adminLog: {
        filterAction: 'Filter action',
        filterActions: 'Filter actions...',
        filterCategory: 'Filter category',
        filterCategories: 'Filter categories...',
        filterStatus: 'Filter status',
        filterStatuses: 'Filter statuses...',
        filterResourceName: 'Filter resource name',
        filterResourceNamePlaceholder: 'Filter resource name...',
        id: '#',
        action: 'Action',
        category: 'Category',
        status: 'Status',
        resourceName: 'Resource Name',
        triggeredBy: 'Triggered By',
        createTime: 'Create Time',
        successful: 'Successful',
        failed: 'Failed',
        viewResourceData: 'View resource data',
        resourceData: 'Resource data',
        actions: {
            callRpc: 'Call RPC',
            create: 'Create',
            createAndStart: 'Create and Start',
            delete: 'Delete',
            deploy: 'Deploy',
            execute: 'Execute',
            flushLog: 'Flush Log',
            kill: 'Kill',
            logIn: 'Log In',
            manage: 'Manage',
            ping: 'Ping',
            reload: 'Reload',
            regenerateKey: 'Regenerate Key',
            resetCounter: 'Reset Counter',
            restart: 'Restart',
            restore: 'Restore',
            resurrect: 'Resurrect',
            revert: 'Revert',
            save: 'Save',
            sendData: 'Send Data',
            sendSignal: 'Send Signal',
            setup: 'Setup',
            start: 'Start',
            stop: 'Stop',
            update: 'Update',
            updatePm2: 'Update PM2',
            upgrade: 'Upgrade',
            upload: 'Upload',
            vacuum: 'Vacuum'
        },
        categories: {
            user: 'User',
            process: 'Process',
            setting: 'Setting',
            communication: 'Communication',
            cleanup: 'Cleanup',
            deployment: 'Deployment',
            action: 'Action',
            backup: 'Backup',
            globalSetting: 'Global Setting'
        }
    },

    // ─── Backup Page ───────────────────────────────────────────────────
    backup: {
        tabs: {
            backup: 'Backup',
            automaticBackup: 'Automatic Backup'
        },
        createBackup: 'Create backup',
        uploadBackupFile: 'Upload backup file',
        id: '#',
        name: 'Name',
        filterName: 'Filter name...',
        size: 'Size',
        processCount: 'Process Count',
        deploymentCount: 'Deployment Count',
        createdBy: 'Created By',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        automatically: 'Automatically',
        download: 'Download',
        restore: 'Restore',
        edit: 'Edit',
        delete: 'Delete',
        enableAutomaticBackup: 'Enable automatic backup',
        automaticBackupDescription: 'Automatic backup occurs 00:00 AM daily',
        errorParsingFile: 'Error parsing file'
    },

    // ─── Communication Page ────────────────────────────────────────────
    communication: {
        send: 'Send',
        filterType: 'Filter type',
        filterTypePlaceholder: 'Filter type...',
        filterName: 'Filter name',
        filterNamePlaceholder: 'Filter name...',
        id: '#',
        type: 'Type',
        name: 'Name',
        triggeredBy: 'Triggered By',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        viewData: 'View data',
        types: {
            receiveData: 'Receive Data',
            requestData: 'Request Data',
            rpc: 'RPC',
            sendSignal: 'Send Signal'
        },
        sendActions: {
            sendSignal: 'Send Signal',
            rpc: 'RPC',
            sendData: 'Send Data'
        }
    },

    // ─── Deployment Page ───────────────────────────────────────────────
    deployment: {
        filterName: 'Filter name...',
        id: '#',
        name: 'Name',
        user: 'User',
        repo: 'Repo',
        createdBy: 'Created By',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        copyRawJson: 'Copy raw JSON',
        deleteItem: 'Delete item',
        editItem: 'Edit item',
        setup: 'Setup',
        deploy: 'Deploy',
        update: 'Update',
        revert: 'Revert',
        revertNumber: 'Revert number',
        viewCurrent: 'View Current',
        viewPrevious: 'View Previous',
        execute: 'Execute',
        command: 'Command',
        list: 'List'
    },

    // ─── Log Page ──────────────────────────────────────────────────────
    log: {
        lineCount: 'Line count',
        autoRefresh: 'Auto refresh',
        refreshLog: 'Refresh log',
        stdOut: 'StdOut',
        stdErr: 'StdErr',
        combined: 'Combined'
    },

    // ─── Metric Page ───────────────────────────────────────────────────
    metric: {
        enableMonitor: 'Enable monitor',
        startTime: 'Start time',
        endTime: 'End time',
        quickSelect: 'Quick select',
        sampleDuration: 'Sample Duration',
        selectMetric: 'Select metric',
        aggregation: 'Aggregation',
        syncMetric: 'Sync metric',
        metricLabel: 'Metric',
        resultsGenerated: '{count} results generated.',
        aggregations: {
            average: 'Average',
            minimum: 'Minimum',
            maximum: 'Maximum',
            sum: 'Sum',
            count: 'Count'
        },
        quickTimes: {
            last5Minutes: 'Last 5 minutes',
            last15Minutes: 'Last 15 minutes',
            last30Minutes: 'Last 30 minutes',
            last1Hour: 'Last 1 hour',
            last3Hours: 'Last 3 hours',
            last6Hours: 'Last 6 hours',
            last12Hours: 'Last 12 hours',
            last1Day: 'Last 1 day',
            last2Days: 'Last 2 days',
            last3Days: 'Last 3 days',
            last7Days: 'Last 7 days'
        }
    },

    // ─── General Settings Page ─────────────────────────────────────────
    general: {
        tabs: {
            subscription: 'Subscription',
            monitor: 'Monitor',
            preferences: 'Preferences'
        },
        messageSubscriptions: 'Message subscriptions',
        watchOutThePerformance: 'Watch out the performance',
        monitorIntervalOfDataCollection: 'Monitor interval of data collection',
        maxSizeOfBufferedMonitorData: 'Max size of buffered monitor data',
        maxAgeOfBufferedMonitorData: 'Max age of buffered monitor data',
        clearPreferences: 'Clear preferences',
        clearPreferencesDescription:
            'Remove locally stored preferences (theme color, appearance, language). The page will reload after clearing.'
    },

    // ─── Security Settings Page ────────────────────────────────────────
    security: {
        regenerateJwtPrivateKey: 'Regenerate JWT private key',
        thisForcesExistingUsersLoggingOut:
            'This forces existing users logging out',
        regenerate: 'Regenerate',
        tokenExpiration: 'Token expiration',
        loggedInUsersAreNotAffected: 'Logged in users are not affected',
        enableCors: 'Enable CORS',
        willTakeEffectAfterRestartServer:
            'Will take effect after restart server'
    },

    // ─── Database Settings Page ────────────────────────────────────────
    database: {
        tabs: {
            cleanup: 'Cleanup',
            automaticCleanup: 'Automatic Cleanup'
        },
        expirationInfo: 'Expiration Info',
        adminLogs: 'Admin logs: {count} item(s).',
        processSettings: 'Process settings: {count} item(s).',
        communicationLogs: 'Communication logs: {count} item(s).',
        processMetrics: 'Process metrics: {count} item(s).',
        setExpirationTime: 'Set Expiration Time',
        cleanUpDatabase: 'Clean Up Database',
        cleanUp: 'Clean Up',
        enableAutomaticDatabaseCleanUp: 'Enable automatic database clean-up',
        automaticCleanupDescription:
            'Automatic database clean-up runs daily at 1:00 AM',
        enableAutomaticVacuum: 'Enable automatic vacuum',
        automaticVacuumDescription:
            'Automatic database vacuum runs daily at 1:00 AM after clean-up',
        vacuumDatabase: 'Vacuum Database',
        vacuum: 'Vacuum',
        vacuumDescription:
            'Rebuild the database file, reclaiming unused space and reducing file size'
    },

    // ─── User Page / UserList Component ────────────────────────────────
    user: {
        id: '#',
        email: 'Email',
        avatar: 'Avatar',
        displayName: 'Display Name',
        enabled: 'Enabled',
        superUser: 'Super User',
        lastLogIn: 'Last Log In',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        yourself: 'Yourself',
        copyRawJson: 'Copy raw JSON',
        deleteItem: 'Delete item',
        editItem: 'Edit item',
        filterEmails: 'Filter emails...'
    },

    // ─── Blade: App (Process) ──────────────────────────────────────────
    appBlade: {
        createProcess: 'Create process',
        updateProcessConfiguration: 'Update process configuration',
        createAndRun: 'Create and Run',
        create: 'Create'
    },

    // ─── Blade: Backup ─────────────────────────────────────────────────
    backupBlade: {
        createBackup: 'Create backup',
        updateBackup: 'Update backup',
        backupName: 'Backup name'
    },

    // ─── Blade: Backup Download ────────────────────────────────────────
    backupDownloadBlade: {
        downloadFile: 'Download file',
        includeProcesses: 'Include processes',
        includeDeployments: 'Include deployments',
        selectFileName: 'Select file name',
        selectDownloadType: 'Select download type',
        downloadTypes: {
            raw: 'Raw',
            json: 'JSON',
            commonJs: 'Common JS',
            esm: 'ESM'
        }
    },

    // ─── Blade: Deployment ─────────────────────────────────────────────
    deploymentBlade: {
        createDeployment: 'Create deployment',
        updateDeployment: 'Update deployment',
        name: 'Name',
        key: 'Key',
        sshKeyPath: 'SSH key path',
        user: 'User',
        sshUser: 'SSH user',
        hosts: 'Hosts',
        sshHosts: 'SSH hosts',
        sshOptions: 'SSH options',
        sshOptionsDescription:
            "SSH options with no command-line flag, see 'man ssh'",
        ref: 'Ref',
        gitRemoteBranch: 'GIT remote/branch',
        repo: 'Repo',
        gitRemote: 'GIT remote',
        path: 'Path',
        pathInTheServer: 'path in the server',
        preSetup: 'Pre-Setup',
        preSetupDescription:
            'Pre-setup command or path to a script on your local machine',
        postSetup: 'Post-Setup',
        postSetupDescription:
            'Post-setup commands or path to a script on the host machine',
        preDeployAction: 'Pre-Deploy Action',
        preDeployActionDescription: 'pre-deploy action',
        postDeployAction: 'Post-Deploy Action',
        postDeployActionDescription: 'post-deploy action'
    },

    // ─── Blade: Description ────────────────────────────────────────────
    descriptionBlade: {
        basicInformation: 'Basic Information',
        attributes: 'Attributes',
        rpcs: 'RPCs',
        metrics: 'Metrics',
        customEnvironmentVariables: 'Custom Environment Variables',
        commonEnvironmentVariables: 'Common Environment Variables',
        builtIn: 'builtIn'
    },

    // ─── Blade: Send Data ──────────────────────────────────────────────
    sendDataBlade: {
        sendData: 'Send data',
        data: 'Data'
    },

    // ─── Blade: Send RPC ───────────────────────────────────────────────
    sendRpcBlade: {
        title: 'Remote Procedure Call (RPC)',
        selectRpcName: 'Select RPC name',
        parameter: 'Parameter'
    },

    // ─── Blade: Send Signal ────────────────────────────────────────────
    sendSignalBlade: {
        sendSignal: 'Send signal',
        selectSignalType: 'Select signal type'
    },

    // ─── Blade: Terminal Result ────────────────────────────────────────
    terminalResultBlade: {
        deploymentResult: 'Deployment Result'
    },

    // ─── Blade: User ───────────────────────────────────────────────────
    userBlade: {
        createUser: 'Create user',
        updateUser: 'Update user',
        email: 'Email',
        enabled: 'Enabled',
        superUser: 'Super User',
        avatar: 'Avatar',
        displayName: 'Display Name',
        password: 'Password'
    },

    // ─── Blade: View Data ──────────────────────────────────────────────
    viewDataBlade: {
        title: 'Remote Procedure Call (RPC)',
        data: 'Data',
        response: 'Response',
        undefined: 'Undefined'
    },

    // ─── Component: DateTimePeriod ─────────────────────────────────────
    dateTimePeriod: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
        milliseconds: 'Milliseconds'
    },

    // ─── Component: EnvironmentProfiles ────────────────────────────────
    environmentProfiles: {
        profiles: 'Profiles',
        newProfile: 'New Profile',
        active: 'Active',
        environmentVariables: 'Environment Variables',
        addVariable: '+ Add Variable',
        variableKeyPlaceholder: 'VARIABLE_KEY',
        valuePlaceholder: 'value',
        syncToAllProfiles: 'Sync to all profiles',
        duplicateProfile: 'Duplicate Profile',
        noVariablesInThisProfile: 'No variables in this profile.',
        jsonStateTesting: 'JSON State (Testing)'
    },

    // ─── Component: FileSelector ───────────────────────────────────────
    fileSelector: {
        selectAFile: 'Select a file',
        accessingFileSystem: 'Accessing File System...',
        cancel: 'Cancel',
        confirm: 'Confirm',
        selectThisFolder: 'Select this folder',
        preview: 'Preview:'
    },

    // ─── Component: Json5 ──────────────────────────────────────────────
    json5: {
        syntaxOk: 'Syntax OK',
        syntaxError: 'Syntax Error',
        prettify: 'PRETTIFY'
    },

    // ─── Component: LogMonitor ─────────────────────────────────────────
    logMonitor: {
        noActiveStreams: 'No active streams.'
    },

    // ─── Component: ProcessSelector ────────────────────────────────────
    processSelector: {
        selectTheProcess: 'Select the process',
        selectProcess: 'Select process'
    },

    // ─── Component: StringList ─────────────────────────────────────────
    stringList: {
        items: 'Items',
        add: 'Add',
        valuePlaceholder: 'Value...',
        listIsEmpty: 'List is empty.'
    },

    // ─── Component: TableFilterResult ──────────────────────────────────
    tableFilterResult: {
        of: 'of',
        rowsFiltered: 'row(s) filtered.'
    },

    // ─── Component: Terminal ───────────────────────────────────────────
    terminal: {
        processInspector: 'Process Inspector',
        success: 'Success',
        timeout: 'Timeout',
        exitCode: 'Exit Code:',
        chunks: 'Chunks'
    },

    // ─── Utils ─────────────────────────────────────────────────────────
    utils: {
        day: 'day',
        days: 'days',
        hour: 'hour',
        hours: 'hours',
        minute: 'minute',
        minutes: 'minutes',
        second: 'second',
        seconds: 'seconds',
        memoryUnits: {
            b: 'B',
            kb: 'KB',
            mb: 'MB',
            gb: 'GB'
        }
    },

    // ─── Parameters (from parameters.js) ───────────────────────────────
    parameters: {
        groups: {
            general: 'General',
            advanced: 'Advanced settings',
            static: 'Serve static pages',
            logs: 'Log files',
            control: 'Control flow'
        },
        props: {
            name: {
                label: 'Application Name',
                description:
                    'The name of the application. Defaults to the script filename without its extension.'
            },
            script: {
                label: 'Script Path',
                description:
                    'The path to the entry point script, relative to the PM2 start command location.'
            },
            cwd: {
                label: 'Working Directory',
                description:
                    'The Current Working Directory (CWD) from which the application will be launched.'
            },
            args: {
                label: 'Script Arguments',
                description:
                    'A string or list containing command-line arguments to be passed to the script.'
            },
            interpreter: {
                label: 'Interpreter Path',
                description:
                    "The absolute path to the interpreter (e.g., Python or Binary). Defaults to 'node'."
            },
            interpreter_args: {
                label: 'Interpreter Arguments',
                description:
                    'Flags or options to be passed directly to the interpreter.'
            },
            node_args: {
                label: 'Node Arguments',
                description: 'An alias for interpreter arguments.'
            },
            instances: {
                label: 'Instance Count',
                description:
                    'The number of application instances to launch. 0 will auto-detect the number of CPU cores and launch that many instances in "cluster" mode.'
            },
            exec_mode: {
                label: 'Execution Mode',
                description:
                    "The mode used to start the app. Options: 'cluster' (load-balanced) or 'fork'. Defaults to 'fork'."
            },
            watch: {
                label: 'Watch and Restart',
                description:
                    'Enables the watch feature. The app reloads automatically if files change in the directory.'
            },
            ignore_watch: {
                label: 'Ignore Watch List',
                description:
                    'A list of strings or regex patterns to be excluded from the file watching feature.'
            },
            max_memory_restart: {
                label: 'Max Memory Restart',
                description:
                    "Automatically restarts the app if it exceeds a specified memory limit (e.g., '150M', '2G')."
            },
            env: {
                label: 'Environment Variables',
                description:
                    'Key-value pairs of environment variables to be injected into the application process.'
            },
            env_: {
                label: 'Custom Environment Profile',
                description:
                    'Environment variables injected when using a specific profile via the --env flag.'
            },
            appendEnvToName: {
                label: 'Append Environment to Name',
                description:
                    "If enabled, appends the environment name to the application name (e.g., 'app-production')."
            },
            source_map_support: {
                label: 'Source Map Support',
                description:
                    'Enables or disables JavaScript source map support for better error stack traces.'
            },
            instance_var: {
                label: 'Instance ID Variable',
                description:
                    'Renames the environment variable used to identify the specific instance number.'
            },
            filter_env: {
                label: 'Environment Filter',
                description:
                    'A list of prefixes used to prevent specific global variables from entering the process.'
            },
            increment_var: {
                label: 'Increment Variable',
                description:
                    'Increment an environment variable for each instance launched.'
            },
            stop_exit_codes: {
                label: 'Stop Exit Codes',
                description:
                    'A list of exit codes that will not trigger a restart of the application.'
            },
            exp_backoff_restart_delay: {
                label: 'Exponential Backoff Delay',
                description:
                    'Increase incrementally the time between restarts exponentially. Set 0 to disable.'
            },
            servePath: {
                label: 'Static Files Path',
                description:
                    'The directory path where static files will be served from.'
            },
            servePort: {
                label: 'Static Files Port',
                description:
                    'The port number on which static files will be served.'
            },
            serveIsSpa: {
                label: 'Serve SPA',
                description:
                    'Enables Single Page Application (SPA) mode for static file serving. It redirects all to index.html'
            },
            serveBasicAuth: {
                label: 'Serve Basic Auth',
                description:
                    'Enables basic authentication for static file serving.'
            },
            serveBasicAuthUser: {
                label: 'Serve Username',
                description:
                    'The username for basic authentication when serving static files.'
            },
            serveBasicAuthPassword: {
                label: 'Serve Password',
                description:
                    'The password for basic authentication when serving static files.'
            },
            log_date_format: {
                label: 'Log Date Format',
                description: 'The timestamp format used for log entries.'
            },
            error_file: {
                label: 'Error Log Path',
                description:
                    "The file path where error logs (stderr) will be stored. Use '/dev/null' to disable."
            },
            out_file: {
                label: 'Output Log Path',
                description:
                    "The file path where standard output logs (stdout) will be stored. Use '/dev/null' to disable."
            },
            log_file: {
                label: 'Log Path',
                description:
                    'A single file path for both stdout and stderr logs.'
            },
            combine_logs: {
                label: 'Disable Log Suffix',
                description:
                    'If enabled, prevents PM2 from appending process IDs to the log filenames.'
            },
            merge_logs: {
                label: 'Merge Logs',
                description: 'An alias to Disable Log Suffix'
            },
            time: {
                label: 'Log Timestamping',
                description:
                    'When enabled, automatically prefixes every log line with a timestamp.'
            },
            pid_file: {
                label: 'PID File Path',
                description:
                    'The path where the Process ID (PID) file is stored for monitoring.'
            },
            min_uptime: {
                label: 'Minimum Uptime',
                description:
                    'The duration the app must stay active to be considered a successful start.'
            },
            listen_timeout: {
                label: 'Listen Timeout',
                description:
                    'Time to wait for the app to begin listening on a port before forcing a reload.'
            },
            kill_timeout: {
                label: 'Kill Timeout',
                description:
                    'The grace period before forcing a hard shutdown (SIGKILL) after a stop signal.'
            },
            shutdown_with_message: {
                label: 'Shutdown via Message',
                description:
                    "Uses a 'shutdown' message instead of a system signal for a more controlled exit."
            },
            wait_ready: {
                label: "Wait for 'Ready' Signal",
                description:
                    "Waits for a manual 'ready' signal from the app instead of waiting for a network port."
            },
            max_restarts: {
                label: 'Max Restart Limit',
                description:
                    'The number of consecutive crashes allowed before PM2 stops attempting to restart.'
            },
            restart_delay: {
                label: 'Restart Delay',
                description:
                    'The amount of time to wait before restarting a crashed application.'
            },
            autorestart: {
                label: 'Auto-Restart',
                description:
                    'When disabled, PM2 will not attempt to restart the app if it exits or crashes.'
            },
            cron_restart: {
                label: 'Cron Schedule Restart',
                description:
                    'A cron pattern used to schedule periodic restarts for the application.'
            },
            vizion: {
                label: 'Version Control Metadata',
                description:
                    'Enables versioning control features (Vizion) for the application.'
            },
            post_update: {
                label: 'Post-Update Commands',
                description:
                    'A list of shell commands to execute after updating the app via the Keymetrics dashboard.'
            },
            force: {
                label: 'Force Start',
                description:
                    'Allows multiple instances of the same script to be started simultaneously.'
            }
        },
        components: {
            enable: 'Enable',
            value: 'Value',
            unit: 'Unit',
            watchForAllFiles: 'Watch for all files',
            fork: 'Fork',
            cluster: 'Cluster'
        }
    }
}
