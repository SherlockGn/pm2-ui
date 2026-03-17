// Too many parameters available in PM2, so let's handle it here and hopefully make it easier to use or maintain.
// This file is shared for both the UI and the backend.

const isEmpty = item =>
    Array.isArray(item) ? item.length === 0 : item == null || item === ''

const isSameObject = (a, b) => {
    const akeys = Object.keys(a)
    const bkeys = Object.keys(b)
    if (akeys.length !== bkeys.length) {
        return false
    }
    for (const key of akeys) {
        if (a[key] !== b[key]) {
            return false
        }
    }
    return true
}

export const pm2Parameters = [
    {
        group: { name: 'general', label: 'General', icon: 'i-lucide-home' },
        items: [
            {
                name: 'name',
                type: 'string',
                example: 'my-api',
                label: 'Application Name',
                description:
                    'The name of the application. Defaults to the script filename without its extension.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => i.name
            },
            {
                name: 'script',
                type: 'string',
                example: './api/app.js',
                label: 'Script Path',
                description:
                    'The path to the entry point script, relative to the PM2 start command location.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => i.script
            },
            {
                name: 'cwd',
                type: 'string',
                example: '/var/www/',
                label: 'Working Directory',
                description:
                    'The Current Working Directory (CWD) from which the application will be launched.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'pm_cwd')?.value ?? null
            },
            {
                name: 'args',
                type: ['string', 'list'],
                example: ['-a', '13', '-b', '12'],
                label: 'Script Arguments',
                description:
                    'A string or list containing command-line arguments to be passed to the script.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => i ?? [],
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'interpreter',
                type: 'string',
                example: '/usr/bin/python',
                label: 'Interpreter Path',
                description:
                    "The absolute path to the interpreter (e.g., Python or Binary). Defaults to 'node'.",
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'exec_interpreter')?.value ??
                    null
            },
            {
                name: 'interpreter_args',
                type: ['string', 'list'],
                example: ['--harmony'],
                label: 'Interpreter Arguments',
                description:
                    'Flags or options to be passed directly to the interpreter.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => i ?? [],
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'node_args',
                type: 'list',
                label: 'Node Arguments',
                description: 'An alias for interpreter arguments.',
                // will be excluded from UI
                toData: () => null,
                fromData: () => null,
                toUI: () => null,
                fromUI: () => null,
                toJson: () => null,
                fromJson: () => null,
                fromProcess: () => null
            }
        ]
    },
    {
        group: {
            name: 'advanced',
            label: 'Advanced settings',
            icon: 'i-lucide-settings'
        },
        items: [
            {
                name: 'instances',
                type: 'number',
                example: 0,
                label: 'Instance Count',
                description:
                    'The number of application instances to launch. 0 will auto-detect the number of CPU cores and launch that many instances in "cluster" mode.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? 0,
                fromUI: i => (i === 0 ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'NODE_APP_INSTANCE')?.value ??
                    null
            },
            {
                name: 'exec_mode',
                type: 'string',
                example: 'cluster',
                label: 'Execution Mode',
                description:
                    "The mode used to start the app. Options: 'cluster' (load-balanced) or 'fork'. Defaults to 'fork'.",
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? 'fork',
                fromUI: i => (i === 'fork' ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => i.exeMode?.replace('_mode', '') ?? null
            },
            {
                name: 'watch',
                type: ['boolean', 'list'],
                example: true,
                label: 'Watch and Restart',
                description:
                    'Enables the watch feature. The app reloads automatically if files change in the directory.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: (i, o) => {
                    const watchForAll = i === true
                    const watchList = Array.isArray(i) ? i : []
                    o['watchForAll'] = watchForAll
                    o['watchList'] = watchList
                },
                fromUI: (i, o) => {
                    if (!o.watchForAll && isEmpty(o.watchList)) {
                        return null
                    }
                    if (o.watchForAll) {
                        return true
                    }
                    return o.watchList
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'ignore_watch',
                type: 'list',
                example: ['[/\\]./', 'node_modules'],
                label: 'Ignore Watch List',
                description:
                    'A list of strings or regex patterns to be excluded from the file watching feature.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => i ?? [],
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'max_memory_restart',
                type: ['number', 'string'],
                example: '150M',
                label: 'Max Memory Restart',
                description:
                    "Automatically restarts the app if it exceeds a specified memory limit (e.g., '150M', '2G').",
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: (i, o) => {
                    let use = false
                    let value = 2
                    let unit = 'G'
                    if (typeof i === 'number') {
                        value = i
                        unit = 'B'
                        use = true
                    }
                    if (typeof i === 'string') {
                        value = parseInt(i.substring(0, i.length - 1))
                        unit = i[i.length - 1]
                        use = true
                    }
                    o['useMaxMemoryRestart'] = use
                    o['maxMemoryRestartValue'] = value
                    o['maxMemoryRestartUnit'] = unit
                },
                fromUI: (i, o) => {
                    if (!o.useMaxMemoryRestart) {
                        return null
                    }
                    if (o.maxMemoryRestartUnit === 'B') {
                        return o.maxMemoryRestartValue
                    }
                    return o.maxMemoryRestartValue + o.maxMemoryRestartUnit
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'env',
                type: 'object',
                example: {
                    active: 0,
                    profiles: [
                        {
                            name: 'default',
                            env: [
                                { key: 'NODE_ENV', value: 'development' },
                                { key: 'ID', value: '42' }
                            ]
                        },
                        {
                            name: 'production',
                            env: [
                                { key: 'NODE_ENV', value: 'production' },
                                { key: 'ID', value: '89' }
                            ]
                        }
                    ]
                },
                label: 'Environment Variables',
                description:
                    'Key-value pairs of environment variables to be injected into the application process.',
                // the environment profile is managed by ourselves.
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => {
                    if (i == null) {
                        return {
                            active: 0,
                            profiles: [{ name: 'default', env: [] }]
                        }
                    }
                    return i
                },
                fromUI: i => {
                    if (
                        i.active === 0 &&
                        i.profiles.length === 1 &&
                        i.profiles[0].name === 'default' &&
                        i.profiles[0].env.length === 0
                    ) {
                        return null
                    }
                    return i
                },
                toJson: (i, o) => {
                    if (i == null) {
                        return null
                    }
                    // { "NODE_ENV": "development", "ID": "42" }
                    const target = i.profiles[i.active]
                    if (!target || target.env.length === 0) {
                        return null
                    }
                    const envObj = {}
                    target.env.forEach(e => {
                        envObj[e.key] = e.value
                    })

                    // inject to env_
                    for (const profile of i.profiles) {
                        const envProfileObj = {}
                        profile.env.forEach(e => {
                            envProfileObj[e.key] = e.value
                        })
                        o[`env_${profile.name}`] = envProfileObj
                    }

                    return envObj
                },
                fromJson: (i, o) => {
                    if (i == null) {
                        return null
                    }
                    const profiles = []
                    let active = 0
                    let index = 0
                    for (const key in o) {
                        if (key.startsWith('env_')) {
                            const envProfile = o[key]
                            const profile = {
                                name: key.substring(4),
                                env: []
                            }
                            for (const key in envProfile) {
                                profile.env.push({
                                    key,
                                    value: envProfile[key]
                                })
                            }
                            if (isSameObject(i ?? {}, envProfile)) {
                                active = index
                            }
                            profiles.push(profile)
                            index++
                        }
                    }
                    return {
                        active,
                        profiles
                    }
                },
                fromProcess: i => {
                    return {
                        active: 0,
                        profiles: [
                            {
                                name: 'default',
                                env: i.env.custom.filter(
                                    item =>
                                        ![
                                            i.name,
                                            'PM2_HOME',
                                            'unique_id',
                                            'PM2_INTERACTOR_PROCESSING',
                                            'PM2_JSON_PROCESSING',
                                            'PM2_SERVE_BASIC_AUTH',
                                            'PM2_SERVE_BASIC_AUTH_PASSWORD',
                                            'PM2_SERVE_BASIC_AUTH_USERNAME',
                                            'PM2_SERVE_PORT',
                                            'PM2_SERVE_PATH',
                                            'PM2_SERVE_SPA'
                                        ].includes(item.key)
                                )
                            }
                        ]
                    }
                }
            },
            {
                name: 'env_',
                type: 'object',
                example: {},
                label: 'Custom Environment Profile',
                description:
                    'Environment variables injected when using a specific profile via the --env flag.',
                // will be excluded from UI
                toData: () => null,
                fromData: () => null,
                toUI: () => null,
                fromUI: () => null,
                toJson: () => null,
                fromJson: () => null,
                fromProcess: () => null
            },
            {
                name: 'appendEnvToName',
                type: 'boolean',
                example: true,
                label: 'Append Environment to Name',
                description:
                    "If enabled, appends the environment name to the application name (e.g., 'app-production').",
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'source_map_support',
                type: 'boolean',
                example: true,
                label: 'Source Map Support',
                description:
                    'Enables or disables JavaScript source map support for better error stack traces.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? true,
                fromUI: i => (i ? null : false),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'instance_var',
                type: 'string',
                example: 'NODE_APP_INSTANCE',
                label: 'Instance ID Variable',
                description:
                    'Renames the environment variable used to identify the specific instance number.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'instance_var')?.value ?? null
            },
            {
                name: 'filter_env',
                type: 'list',
                example: ['REACT_'],
                label: 'Environment Filter',
                description:
                    'A list of prefixes used to prevent specific global variables from entering the process.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => i ?? [],
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'increment_var',
                type: 'string',
                example: 'PORT',
                label: 'Increment Variable',
                description:
                    'Increment an environment variable for each instance launched.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'stop_exit_codes',
                type: 'list',
                example: [0, 1],
                label: 'Stop Exit Codes',
                description:
                    'A list of exit codes that will not trigger a restart of the application.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => (i ?? []).map(i => `${i}`),
                fromUI: i =>
                    isEmpty(i)
                        ? null
                        : i
                              .filter(item => /^\d+$/.test(item))
                              .map(item => +item),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'exp_backoff_restart_delay',
                type: 'number',
                example: 100,
                label: 'Exponential Backoff Delay',
                description:
                    'Increase incrementally the time between restarts exponentially. Set 0 to disable.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? 0,
                fromUI: i => (i === 0 ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            }
        ]
    },
    {
        group: {
            name: 'static',
            label: 'Serve static pages',
            icon: 'i-lucide-chrome'
        },
        items: [
            {
                name: 'servePath',
                type: 'string',
                example: '~/public',
                label: 'Static Files Path',
                description:
                    'The directory path where static files will be served from.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: (i, o) => {
                    if (i) {
                        if (!o.env) {
                            o.env = {}
                        }
                        o.env['PM2_SERVE_PATH'] = i
                    }
                },
                fromJson: (i, o) => o.env?.['PM2_SERVE_PATH'] ?? null,
                fromProcess: i =>
                    i.env.custom.find(i => i.key === 'PM2_SERVE_PATH')?.value ??
                    null
            },
            {
                name: 'servePort',
                type: 'number',
                example: 8080,
                label: 'Static Files Port',
                description:
                    'The port number on which static files will be served.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? 8080,
                fromUI: i => (i === 8080 ? null : i),
                toJson: (i, o) => {
                    if (i != null) {
                        if (!o.env) {
                            o.env = {}
                        }
                        o.env['PM2_SERVE_PORT'] = `${i}`
                    }
                },
                fromJson: (i, o) => {
                    if (o.env?.['PM2_SERVE_PORT'] != null) {
                        return +o.env['PM2_SERVE_PORT']
                    }
                    return null
                },
                fromProcess: i => {
                    const item = i.env.custom.find(
                        i => i.key === 'PM2_SERVE_PORT'
                    )
                    return item ? +item.value : null
                }
            },
            {
                name: 'serveIsSpa',
                type: 'boolean',
                example: true,
                label: 'Serve SPA',
                description:
                    'Enables Single Page Application (SPA) mode for static file serving. It redirects all to index.html',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: (i, o) => {
                    if (i != null) {
                        if (!o.env) {
                            o.env = {}
                        }
                        o.env['PM2_SERVE_SPA'] = `${i}`
                    }
                },
                fromJson: (i, o) => {
                    if (o.env?.['PM2_SERVE_SPA'] != null) {
                        return o.env['PM2_SERVE_SPA'] === 'true'
                    }
                    return null
                },
                fromProcess: i => {
                    const item = i.env.custom.find(
                        i => i.key === 'PM2_SERVE_SPA'
                    )
                    return item ? item.value === 'true' : null
                }
            },
            {
                name: 'serveBasicAuth',
                type: 'boolean',
                example: true,
                label: 'Serve Basic Auth',
                description:
                    'Enables basic authentication for static file serving.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: (i, o) => {
                    if (i != null) {
                        if (!o.env) {
                            o.env = {}
                        }
                        o.env['PM2_SERVE_BASIC_AUTH'] = `${i}`
                    }
                },
                fromJson: (i, o) => {
                    if (o.env?.['PM2_SERVE_BASIC_AUTH'] != null) {
                        return o.env['PM2_SERVE_BASIC_AUTH'] === 'true'
                    }
                    return null
                },
                fromProcess: i => {
                    const item = i.env.custom.find(
                        i => i.key === 'PM2_SERVE_BASIC_AUTH'
                    )
                    return item ? item.value === 'true' : null
                }
            },
            {
                name: 'serveBasicAuthUser',
                type: 'string',
                example: 'admin',
                label: 'Serve Username',
                description:
                    'The username for basic authentication when serving static files.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: (i, o) => {
                    if (i) {
                        if (!o.env) {
                            o.env = {}
                        }
                        o.env['PM2_SERVE_BASIC_AUTH_USERNAME'] = i
                    }
                },
                fromJson: (i, o) =>
                    o.env?.['PM2_SERVE_BASIC_AUTH_USERNAME'] ?? null,
                fromProcess: i =>
                    i.env?.custom.find(
                        i => i.key === 'PM2_SERVE_BASIC_AUTH_USERNAME'
                    )?.value ?? null
            },
            {
                name: 'serveBasicAuthPassword',
                type: 'string',
                example: 'password',
                label: 'Serve Password',
                description:
                    'The password for basic authentication when serving static files.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: (i, o) => {
                    if (i) {
                        if (!o.env) {
                            o.env = {}
                        }
                        o.env['PM2_SERVE_BASIC_AUTH_PASSWORD'] = i
                    }
                },
                fromJson: (i, o) =>
                    o.env?.['PM2_SERVE_BASIC_AUTH_PASSWORD'] ?? null,
                fromProcess: i =>
                    i.env?.custom.find(
                        i => i.key === 'PM2_SERVE_BASIC_AUTH_PASSWORD'
                    )?.value ?? null
            }
        ]
    },
    {
        group: { name: 'logs', label: 'Log files', icon: 'i-lucide-file-text' },
        items: [
            {
                name: 'log_date_format',
                type: 'string',
                example: 'YYYY-MM-DD HH:mm Z',
                label: 'Log Date Format',
                description: 'The timestamp format used for log entries.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'error_file',
                type: 'string',
                example: '~/pm2/logs/app-error.log',
                label: 'Error Log Path',
                description:
                    "The file path where error logs (stderr) will be stored. Use '/dev/null' to disable.",
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'pm_err_log_path')?.value ??
                    null
            },
            {
                name: 'out_file',
                type: 'string',
                example: '~/pm2/logs/app-out.log',
                label: 'Output Log Path',
                description:
                    "The file path where standard output logs (stdout) will be stored. Use '/dev/null' to disable.",
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'pm_out_log_path')?.value ??
                    null
            },
            {
                name: 'log_file',
                type: 'string',
                example: '~/pm2/logs/app.log',
                label: 'Log Path',
                description:
                    'A single file path for both stdout and stderr logs.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'pm_log_path')?.value ?? null
            },
            {
                name: 'combine_logs',
                type: 'boolean',
                example: true,
                label: 'Disable Log Suffix',
                description:
                    'If enabled, prevents PM2 from appending process IDs to the log filenames.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'merge_logs')?.value ?? null
            },
            {
                name: 'merge_logs',
                type: 'boolean',
                example: true,
                label: 'Merge Logs',
                description: 'An alias to Disable Log Suffix',
                // will be excluded from UI
                toData: i => null,
                fromData: i => null,
                toUI: i => null,
                fromUI: i => null,
                toJson: i => null,
                fromJson: i => null,
                fromProcess: i => null
            },
            {
                name: 'time',
                type: 'boolean',
                example: 'false',
                label: 'Log Timestamping',
                description:
                    'When enabled, automatically prefixes every log line with a timestamp.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'log_timestamp')?.value ?? null
            },
            {
                name: 'pid_file',
                type: 'string',
                example: '~/pm2/pids/app.pid',
                label: 'PID File Path',
                description:
                    'The path where the Process ID (PID) file is stored for monitoring.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(i => i.key === 'pm_pid_path')?.value ?? null
            }
        ]
    },
    {
        group: {
            name: 'control',
            label: 'Control flow',
            icon: 'i-lucide-code'
        },
        items: [
            {
                name: 'min_uptime',
                type: ['number', 'string'],
                example: 2000,
                label: 'Minimum Uptime',
                description:
                    'The duration the app must stay active to be considered a successful start.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: (i, o) => {
                    let use = false
                    let value = 2000
                    let unit = 'ms'
                    if (typeof i === 'string') {
                        use = true
                        value = parseInt(i.substring(0, i.length - 1))
                        unit = i.substring(i.length - 1)
                    }
                    if (typeof i === 'number') {
                        use = true
                        value = i
                    }
                    o['useMinUptime'] = use
                    o['minUptimeValue'] = value
                    o['minUptimeUnit'] = unit
                },
                fromUI: (i, o) => {
                    if (!o['useMinUptime']) {
                        return null
                    }
                    if (o['minUptimeUnit'] === 'ms') {
                        return o['minUptimeValue']
                    }
                    return `${o['minUptimeValue']}${o['minUptimeUnit']}`
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'listen_timeout',
                type: 'number',
                example: 8000,
                label: 'Listen Timeout',
                description:
                    'Time to wait for the app to begin listening on a port before forcing a reload.',
                toData: i => i,
                fromData: i => i,
                toUI: (i, o) => {
                    let use = false
                    let value = 8000
                    let unit = 'ms'
                    if (typeof i === 'number') {
                        use = true
                        value = i
                    }
                    o['useListenTimeout'] = use
                    o['listenTimeoutValue'] = value
                    o['listenTimeoutUnit'] = unit
                },
                fromUI: (i, o) => {
                    if (!o['useListenTimeout']) {
                        return null
                    }
                    if (o['listenTimeoutUnit'] === 'ms') {
                        return o['listenTimeoutValue']
                    }
                    if (o['listenTimeoutUnit'] === 's') {
                        return o['listenTimeoutValue'] * 1000
                    }
                    if (o['listenTimeoutUnit'] === 'm') {
                        return o['listenTimeoutValue'] * 1000 * 60
                    }
                    if (o['listenTimeoutUnit'] === 'h') {
                        return o['listenTimeoutValue'] * 1000 * 60 * 60
                    }
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'kill_timeout',
                type: 'number',
                example: 1600,
                label: 'Kill Timeout',
                description:
                    'The grace period before forcing a hard shutdown (SIGKILL) after a stop signal.',
                toData: i => i,
                fromData: i => i,
                toUI: (i, o) => {
                    let use = false
                    let value = 1600
                    let unit = 'ms'
                    if (typeof i === 'number') {
                        use = true
                        value = i
                    }
                    o['useKillTimeout'] = use
                    o['killTimeoutValue'] = value
                    o['killTimeoutUnit'] = unit
                },
                fromUI: (i, o) => {
                    if (!o['useKillTimeout']) {
                        return null
                    }
                    if (o['killTimeoutUnit'] === 'ms') {
                        return o['killTimeoutValue']
                    }
                    if (o['killTimeoutUnit'] === 's') {
                        return o['killTimeoutValue'] * 1000
                    }
                    if (o['killTimeoutUnit'] === 'm') {
                        return o['killTimeoutValue'] * 1000 * 60
                    }
                    if (o['killTimeoutUnit'] === 'h') {
                        return o['killTimeoutValue'] * 1000 * 60 * 60
                    }
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'shutdown_with_message',
                type: 'boolean',
                example: false,
                label: 'Shutdown via Message',
                description:
                    "Uses a 'shutdown' message instead of a system signal for a more controlled exit.",
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'wait_ready',
                type: 'boolean',
                example: false,
                label: "Wait for 'Ready' Signal",
                description:
                    "Waits for a manual 'ready' signal from the app instead of waiting for a network port.",
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'max_restarts',
                type: 'number',
                example: 10,
                label: 'Max Restart Limit',
                description:
                    'The number of consecutive crashes allowed before PM2 stops attempting to restart.',
                toData: i => i,
                fromData: i => i,
                toUI: (i, o) => {
                    let use = false
                    let value = 10
                    if (typeof i === 'number') {
                        use = true
                        value = i
                    }
                    o['useMaxRestarts'] = use
                    o['maxRestartsValue'] = value
                },
                fromUI: (i, o) => {
                    if (!o['useMaxRestarts']) {
                        return null
                    }
                    return o['maxRestartsValue']
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'restart_delay',
                type: 'number',
                example: 4000,
                label: 'Restart Delay',
                description:
                    'The amount of time to wait before restarting a crashed application.',
                toData: i => i,
                fromData: i => i,
                toUI: (i, o) => {
                    let use = false
                    let value = 2000
                    let unit = 'ms'
                    if (typeof i === 'number') {
                        use = true
                        value = i
                    }
                    o['useRestartDelay'] = use
                    o['restartDelayValue'] = value
                    o['restartDelayUnit'] = unit
                },
                fromUI: (i, o) => {
                    if (!o['useRestartDelay']) {
                        return null
                    }
                    if (o['restartDelayUnit'] === 'ms') {
                        return o['restartDelayValue']
                    }
                    if (o['restartDelayUnit'] === 's') {
                        return o['restartDelayValue'] * 1000
                    }
                    if (o['restartDelayUnit'] === 'm') {
                        return o['restartDelayValue'] * 1000 * 60
                    }
                    if (o['restartDelayUnit'] === 'h') {
                        return o['restartDelayValue'] * 1000 * 60 * 60
                    }
                },
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'autorestart',
                type: 'boolean',
                example: false,
                label: 'Auto-Restart',
                description:
                    'When disabled, PM2 will not attempt to restart the app if it exits or crashes.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? true,
                fromUI: i => (i ? null : false),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'cron_restart',
                type: 'string',
                example: '"1 0 * * *"',
                label: 'Cron Schedule Restart',
                description:
                    'A cron pattern used to schedule periodic restarts for the application.',
                toData: i => i,
                fromData: i => i,
                toUI: i => i ?? '',
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'vizion',
                type: 'boolean',
                example: false,
                label: 'Version Control Metadata',
                description:
                    'Enables versioning control features (Vizion) for the application.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? true,
                fromUI: i => (i ? null : false),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i =>
                    i.attrs.find(a => a.key === 'vizion')?.value ?? null
            },
            {
                name: 'post_update',
                type: 'list',
                example: ['npm install', 'echo launching the app'],
                label: 'Post-Update Commands',
                description:
                    'A list of shell commands to execute after updating the app via the Keymetrics dashboard.',
                toData: i => (i == null ? null : JSON.stringify(i)),
                fromData: i => (i == null ? null : JSON.parse(i)),
                toUI: i => i ?? [],
                fromUI: i => (isEmpty(i) ? null : i),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            },
            {
                name: 'force',
                type: 'boolean',
                example: true,
                label: 'Force Start',
                description:
                    'Allows multiple instances of the same script to be started simultaneously.',
                toData: i => (i == null ? null : +i),
                fromData: i => (i == null ? null : !!i),
                toUI: i => i ?? false,
                fromUI: i => (i ? true : null),
                toJson: i => i,
                fromJson: i => i ?? null,
                fromProcess: i => null
            }
        ]
    }
]

export const components = [
    {
        name: 'script',
        component: 'fileSelector',
        attrs: {
            type: 'file'
        }
    },
    {
        name: 'cwd',
        component: 'fileSelector'
    },
    {
        name: 'exec_mode',
        component: 'selector',
        attrs: {
            items: [
                {
                    label: 'Fork',
                    value: 'fork'
                },
                {
                    label: 'Cluster',
                    value: 'cluster'
                }
            ]
        }
    },
    {
        name: 'useMaxMemoryRestart',
        help: 'Enable'
    },
    {
        name: 'maxMemoryRestartValue',
        help: 'Value',
        disable: item => !item['useMaxMemoryRestart']
    },
    {
        name: 'maxMemoryRestartUnit',
        component: 'selector',
        attrs: {
            items: ['B', 'K', 'M', 'G']
        },
        help: 'Unit',
        disable: item => !item['useMaxMemoryRestart']
    },
    {
        name: 'useMinUptime',
        help: 'Enable'
    },
    {
        name: 'minUptimeValue',
        help: 'Value',
        disable: item => !item['useMinUptime']
    },
    {
        name: 'minUptimeUnit',
        component: 'selector',
        attrs: {
            items: [
                { value: 'ms', label: 'Milliseconds' },
                { value: 's', label: 'Seconds' },
                { value: 'm', label: 'Minutes' },
                { value: 'h', label: 'Hours' }
            ]
        },
        help: 'Unit',
        disable: item => !item['useMinUptime']
    },
    {
        name: 'useListenTimeout',
        help: 'Enable'
    },
    {
        name: 'listenTimeoutValue',
        help: 'Value',
        disable: item => !item['useListenTimeout']
    },
    {
        name: 'listenTimeoutUnit',
        component: 'selector',
        attrs: {
            items: [
                { value: 'ms', label: 'Milliseconds' },
                { value: 's', label: 'Seconds' },
                { value: 'm', label: 'Minutes' },
                { value: 'h', label: 'Hours' }
            ]
        },
        help: 'Unit',
        disable: item => !item['useListenTimeout']
    },
    {
        name: 'useKillTimeout',
        help: 'Enable'
    },
    {
        name: 'killTimeoutValue',
        help: 'Value',
        disable: item => !item['useKillTimeout']
    },
    {
        name: 'killTimeoutUnit',
        component: 'selector',
        attrs: {
            items: [
                { value: 'ms', label: 'Milliseconds' },
                { value: 's', label: 'Seconds' },
                { value: 'm', label: 'Minutes' },
                { value: 'h', label: 'Hours' }
            ]
        },
        help: 'Unit',
        disable: item => !item['useKillTimeout']
    },
    {
        name: 'useMaxRestarts',
        help: 'Enable'
    },
    {
        name: 'maxRestartsValue',
        help: 'Value',
        disable: item => !item['useMaxRestarts']
    },
    {
        name: 'useRestartDelay',
        help: 'Enable'
    },
    {
        name: 'restartDelayValue',
        help: 'Value',
        disable: item => !item['useRestartDelay']
    },
    {
        name: 'restartDelayUnit',
        component: 'selector',
        attrs: {
            items: [
                { value: 'ms', label: 'Milliseconds' },
                { value: 's', label: 'Seconds' },
                { value: 'm', label: 'Minutes' },
                { value: 'h', label: 'Hours' }
            ]
        },
        help: 'Unit',
        disable: item => !item['useRestartDelay']
    },
    {
        name: 'watchForAll',
        help: 'Watch for all files'
    },
    {
        name: 'env',
        component: 'envProfile'
    },
    {
        name: 'error_file',
        component: 'fileSelector'
    },
    {
        name: 'out_file',
        component: 'fileSelector'
    },
    {
        name: 'log_file',
        component: 'fileSelector'
    },
    {
        name: 'pid_file',
        component: 'fileSelector'
    },
    {
        name: 'servePath',
        component: 'fileSelector'
    },
    {
        name: 'serveBasicAuthPassword',
        component: 'password'
    }
]

export const allProps = () => {
    const props = []
    for (const { group, items } of pm2Parameters) {
        props.push(...items)
    }
    return props
}

export const propsOfGroup = group => {
    for (const { group: g, items } of pm2Parameters) {
        if (g.name === group) {
            return items
        }
    }
}

export const uiPropsOfGroup = group => {
    for (const { group: g, items } of pm2Parameters) {
        if (g.name === group) {
            const ret = []
            for (const item of items) {
                const o = {}
                const data = item.toUI(undefined, o)
                if (data !== undefined) {
                    o[item.name] = data
                }
                ret.push({
                    prop: item.name,
                    uiProps: Object.entries(o).map(([k, v]) => ({ k, v }))
                })
            }
            return ret
        }
    }
}

export const getProp = name => {
    for (const { group, items } of pm2Parameters) {
        for (const item of items) {
            if (item.name === name) {
                return item
            }
        }
    }
}

export const allGroups = () => {
    const groups = []
    for (const { group, items } of pm2Parameters) {
        groups.push(group)
    }
    return groups
}

export const toDataObject = app => {
    const result = {}
    for (const prop of allProps()) {
        result[prop.name] = prop.toData(app[prop.name], result) ?? null
    }
    return result
}

export const fromDataObject = app => {
    const result = {}
    for (const prop of allProps()) {
        result[prop.name] = prop.fromData(app[prop.name], app)
    }
    return result
}

export const toUIObject = app => {
    const result = {}
    for (const prop of allProps()) {
        const data = prop.toUI(app[prop.name], result)
        if (data !== undefined) {
            result[prop.name] = data
        }
    }
    return result
}

export const fromUIObject = app => {
    const result = {}
    for (const prop of allProps()) {
        const data = prop.fromUI(app[prop.name], app)
        if (data !== undefined) {
            result[prop.name] = data
        }
    }
    return result
}

export const toJsonObject = app => {
    const result = {}
    for (const prop of allProps()) {
        const data = prop.toJson(app[prop.name], result)
        if (data !== undefined && data !== null) {
            result[prop.name] = data
        }
    }
    return result
}

export const fromJsonObject = app => {
    const result = {}
    for (const prop of allProps()) {
        const data = prop.fromJson(app[prop.name], app)
        if (data !== undefined) {
            result[prop.name] = data
        }
    }
    return result
}

export const fromProcess = process => {
    const result = {}
    for (const prop of allProps()) {
        const data = prop.fromProcess(process)
        if (data !== undefined) {
            result[prop.name] = data
        }
    }
    return result
}

export const merge = (target, newApp) => {
    for (const prop of allProps()) {
        if (newApp[prop.name] !== undefined) {
            target[prop.name] = newApp[prop.name]
        }
    }
}

export const generateTable = () => {
    const rows = []
    for (const prop of allProps()) {
        let dbType
        if (
            Array.isArray(prop.type) ||
            prop.type === 'list' ||
            prop.type === 'object'
        ) {
            // store JSON
            dbType = 'TEXT'
        } else if (prop.type === 'string') {
            dbType = 'TEXT'
        } else if (prop.type === 'boolean') {
            dbType = 'TINYINT'
        } else if (prop.type === 'number') {
            dbType = 'INT'
        } else {
            throw new Error(`Unknown type: ${prop.type} of ${prop.name}`)
        }
        rows.push({
            name: prop.name,
            type: dbType
        })
    }
    return rows
}

export const generatePropValues = app => {
    return allProps().map(prop => ({
        name: prop.name,
        value: app[prop.name]
    }))
}

export const getDefaultUIObject = () => {
    return toUIObject({})
}

export const getDefaultDataObject = () => {
    return toDataObject({})
}
