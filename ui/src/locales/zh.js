export default {
    common: {
        refresh: '刷新',
        submit: '提交',
        create: '创建',
        update: '更新',
        delete: '删除',
        cancel: '取消',
        confirm: '确认',
        actions: '操作',
        columns: '列',
        name: '名称',
        email: '邮箱',
        enabled: '已启用',
        na: '无',
        anonymous: '匿名',
        unmanaged: '未托管',
        required: '必填'
    },

    toast: {
        refreshedSuccessfully: '刷新成功！',
        createdSuccessfully: '创建成功！',
        updatedSuccessfully: '更新成功！',
        deletedSuccessfully: '删除成功！',
        copiedSuccessfully: '复制成功！',
        sentSuccessfully: '发送成功！',
        downloadedSuccessfully: '下载成功！',
        restoredSuccessfully: '恢复成功！',
        uploadedSuccessfully: '上传成功！',
        cleanedUpSuccessfully: '清理成功！',
        vacuumedSuccessfully: '整理成功！',
        managedSuccessfully: '托管成功！',
        restartedSuccessfully: '重启成功！',
        reloadedSuccessfully: '重载成功！',
        stoppedSuccessfully: '停止成功！',
        startedSuccessfully: '启动成功！',
        duplicatedSuccessfully: '复制成功！'
    },

    error: {
        sessionExpired: '会话已过期。',
        sessionExpiredDescription: '您的会话已过期，请重新登录。',
        error: '错误。',
        anErrorOccurred: '发生了一个错误。',
        invalidCredentials: '凭证无效。',
        invalidCredentialsDescription: '您输入的凭证无效。'
    },

    login: {
        title: '登录',
        description: '输入您的凭证以访问仪表盘。',
        email: '邮箱',
        password: '密码',
        welcomeDescription: '欢迎！您已成功登录，现在可以管理您的进程了。'
    },

    dashboard: {
        appName: 'PM2 UI',
        goTo: '前往...',
        nav: {
            home: '首页',
            management: '管理',
            logs: '日志',
            metric: '指标',
            communication: '通信',
            deployment: '部署',
            action: '操作',
            backup: '备份',
            settings: '设置',
            general: '常规',
            security: '安全',
            database: '数据库',
            administration: '管理',
            adminLog: '管理日志',
            user: '用户'
        }
    },

    userMenu: {
        theme: '主题',
        appearance: '外观',
        light: '浅色',
        dark: '深色',
        logOut: '退出登录',
        language: '语言'
    },

    stats: {
        totalCount: '总数',
        runningCount: '运行中',
        stoppedCount: '已停止',
        totalRestartCount: '总重启次数'
    },

    processList: {
        filterName: '筛选名称...',
        id: '#',
        name: '名称',
        script: '脚本',
        status: '状态',
        mode: '模式',
        restartCount: '重启次数',
        runPeriod: '运行时长',
        cpu: 'CPU',
        memory: '内存',
        createdBy: '创建者',
        createTime: '创建时间',
        start: '启动',
        restart: '重启',
        reload: '重载',
        stop: '停止',
        delete: '删除',
        editConfigurations: '编辑配置',
        manageConfiguration: '管理配置',
        viewDescription: '查看描述',
        copyConfigurationAsJson: '复制配置为 JSON',
        duplicateConfiguration: '复制配置',
        restartRequired: '需要重启'
    },

    action: {
        tabs: {
            process: '进程',
            startup: '启动脚本',
            persist: '持久化',
            global: '全局'
        },
        resetProcessRestartCounter: '重置进程重启计数器',
        reset: '重置',
        clearLogFile: '清除日志文件',
        clear: '清除',
        generateStartupScript: '生成启动脚本',
        startup: '启动',
        generateUnstartupScript: '生成取消启动脚本',
        unstartup: '取消启动',
        saveProcesses: '保存进程',
        save: '保存',
        resurrectProcesses: '恢复进程',
        resurrect: '恢复',
        processesResurrectedWillBeUnmanaged: '恢复的进程将处于未托管状态',
        updateTheInMemoryPm2Daemon: '更新内存中的 PM2 守护进程',
        killThePm2Daemon: '终止 PM2 守护进程',
        kill: '终止',
        killWarning: '此操作后所有功能将停止工作，所有 PM2 进程将被删除',
        pingOrDaemonizedPm2: '检测或守护 PM2',
        ping: '检测',
        pingOrStartThePm2Daemon: '检测或启动 PM2 守护进程',
        killTheDaemon: '终止守护进程'
    },

    adminLog: {
        filterAction: '筛选操作',
        filterActions: '筛选操作...',
        filterCategory: '筛选类别',
        filterCategories: '筛选类别...',
        filterStatus: '筛选状态',
        filterStatuses: '筛选状态...',
        filterResourceName: '筛选资源名称',
        filterResourceNamePlaceholder: '筛选资源名称...',
        id: '#',
        action: '操作',
        category: '类别',
        status: '状态',
        resourceName: '资源名称',
        triggeredBy: '触发者',
        createTime: '创建时间',
        successful: '成功',
        failed: '失败',
        viewResourceData: '查看资源数据',
        resourceData: '资源数据',
        actions: {
            callRpc: '调用 RPC',
            create: '创建',
            createAndStart: '创建并启动',
            delete: '删除',
            deploy: '部署',
            execute: '执行',
            flushLog: '清空日志',
            kill: '终止',
            logIn: '登录',
            manage: '管理',
            ping: '检测',
            reload: '重载',
            regenerateKey: '重新生成密钥',
            resetCounter: '重置计数器',
            restart: '重启',
            restore: '恢复',
            resurrect: '复活',
            revert: '回退',
            save: '保存',
            sendData: '发送数据',
            sendSignal: '发送信号',
            setup: '设置',
            start: '启动',
            stop: '停止',
            update: '更新',
            updatePm2: '更新 PM2',
            upgrade: '升级',
            upload: '上传',
            vacuum: '整理'
        },
        categories: {
            user: '用户',
            process: '进程',
            setting: '设置',
            communication: '通信',
            cleanup: '清理',
            deployment: '部署',
            action: '操作',
            backup: '备份',
            globalSetting: '全局设置'
        }
    },

    backup: {
        tabs: {
            backup: '备份',
            automaticBackup: '自动备份'
        },
        createBackup: '创建备份',
        uploadBackupFile: '上传备份文件',
        id: '#',
        name: '名称',
        filterName: '筛选名称…',
        size: '大小',
        processCount: '进程数量',
        deploymentCount: '部署数量',
        createdBy: '创建者',
        createTime: '创建时间',
        updateTime: '更新时间',
        automatically: '自动',
        download: '下载',
        restore: '恢复',
        edit: '编辑',
        delete: '删除',
        enableAutomaticBackup: '启用自动备份',
        automaticBackupDescription: '每日 00:00 自动备份',
        errorParsingFile: '文件解析错误'
    },

    communication: {
        send: '发送',
        filterType: '筛选类型',
        filterTypePlaceholder: '筛选类型...',
        filterName: '筛选名称',
        filterNamePlaceholder: '筛选名称...',
        id: '#',
        type: '类型',
        name: '名称',
        triggeredBy: '触发者',
        createTime: '创建时间',
        updateTime: '更新时间',
        viewData: '查看数据',
        types: {
            receiveData: '接收数据',
            requestData: '请求数据',
            rpc: 'RPC',
            sendSignal: '发送信号'
        },
        sendActions: {
            sendSignal: '发送信号',
            rpc: 'RPC',
            sendData: '发送数据'
        }
    },

    deployment: {
        filterName: '筛选名称...',
        id: '#',
        name: '名称',
        user: '用户',
        repo: '仓库',
        createdBy: '创建者',
        createTime: '创建时间',
        updateTime: '更新时间',
        copyRawJson: '复制原始 JSON',
        deleteItem: '删除项目',
        editItem: '编辑项目',
        setup: '设置',
        deploy: '部署',
        update: '更新',
        revert: '回退',
        revertNumber: '回退编号',
        viewCurrent: '查看当前',
        viewPrevious: '查看上一个',
        execute: '执行',
        command: '命令',
        list: '列表'
    },

    log: {
        lineCount: '行数',
        autoRefresh: '自动刷新',
        refreshLog: '刷新日志',
        stdOut: '标准输出',
        stdErr: '标准错误',
        combined: '合并'
    },

    metric: {
        enableMonitor: '启用监控',
        startTime: '开始时间',
        endTime: '结束时间',
        quickSelect: '快速选择',
        sampleDuration: '采样间隔',
        selectMetric: '选择指标',
        aggregation: '聚合',
        syncMetric: '同步指标',
        metricLabel: '指标',
        resultsGenerated: '已生成 {count} 个结果。',
        aggregations: {
            average: '平均值',
            minimum: '最小值',
            maximum: '最大值',
            sum: '总和',
            count: '计数'
        },
        quickTimes: {
            last5Minutes: '最近 5 分钟',
            last15Minutes: '最近 15 分钟',
            last30Minutes: '最近 30 分钟',
            last1Hour: '最近 1 小时',
            last3Hours: '最近 3 小时',
            last6Hours: '最近 6 小时',
            last12Hours: '最近 12 小时',
            last1Day: '最近 1 天',
            last2Days: '最近 2 天',
            last3Days: '最近 3 天',
            last7Days: '最近 7 天'
        }
    },

    general: {
        tabs: {
            subscription: '订阅',
            monitor: '监控',
            preferences: '偏好设置'
        },
        messageSubscriptions: '消息订阅',
        watchOutThePerformance: '注意性能影响',
        monitorIntervalOfDataCollection: '监控数据采集间隔',
        maxSizeOfBufferedMonitorData: '缓冲监控数据最大数量',
        maxAgeOfBufferedMonitorData: '缓冲监控数据最大时长',
        clearPreferences: '清除偏好设置',
        clearPreferencesDescription:
            '清除本地存储的偏好设置（主题颜色、外观模式、语言）。清除后页面将重新加载。'
    },

    security: {
        regenerateJwtPrivateKey: '重新生成 JWT 私钥',
        thisForcesExistingUsersLoggingOut: '这将强制所有已登录用户退出',
        regenerate: '重新生成',
        tokenExpiration: '令牌过期时间',
        loggedInUsersAreNotAffected: '已登录用户不受影响',
        enableCors: '启用 CORS',
        willTakeEffectAfterRestartServer: '重启服务器后生效'
    },

    database: {
        tabs: {
            cleanup: '清理',
            automaticCleanup: '自动清理'
        },
        expirationInfo: '过期信息',
        adminLogs: '管理日志：{count} 条。',
        processSettings: '进程设置：{count} 条。',
        communicationLogs: '通信日志：{count} 条。',
        processMetrics: '进程指标：{count} 条。',
        setExpirationTime: '设置过期时间',
        cleanUpDatabase: '清理数据库',
        cleanUp: '清理',
        enableAutomaticDatabaseCleanUp: '启用自动数据库清理',
        automaticCleanupDescription: '每日凌晨 1:00 自动清理数据库',
        enableAutomaticVacuum: '启用自动整理',
        automaticVacuumDescription: '每日凌晨 1:00 清理后自动整理数据库',
        vacuumDatabase: '整理数据库',
        vacuum: '整理',
        vacuumDescription: '重建数据库文件，回收未使用的空间并减小文件大小'
    },

    user: {
        id: '#',
        email: '邮箱',
        avatar: '头像',
        displayName: '显示名称',
        enabled: '已启用',
        superUser: '超级用户',
        lastLogIn: '最后登录',
        createTime: '创建时间',
        updateTime: '更新时间',
        yourself: '本人',
        copyRawJson: '复制原始 JSON',
        deleteItem: '删除项目',
        editItem: '编辑项目',
        filterEmails: '筛选邮箱...'
    },

    appBlade: {
        createProcess: '创建进程',
        updateProcessConfiguration: '更新进程配置',
        createAndRun: '创建并运行',
        create: '创建'
    },

    backupBlade: {
        createBackup: '创建备份',
        updateBackup: '更新备份',
        backupName: '备份名称'
    },

    backupDownloadBlade: {
        downloadFile: '下载文件',
        includeProcesses: '包含进程',
        includeDeployments: '包含部署',
        selectFileName: '选择文件名',
        selectDownloadType: '选择下载类型',
        downloadTypes: {
            raw: '原始',
            json: 'JSON',
            commonJs: 'Common JS',
            esm: 'ESM'
        }
    },

    deploymentBlade: {
        createDeployment: '创建部署',
        updateDeployment: '更新部署',
        name: '名称',
        key: '密钥',
        sshKeyPath: 'SSH 密钥路径',
        user: '用户',
        sshUser: 'SSH 用户',
        hosts: '主机',
        sshHosts: 'SSH 主机',
        sshOptions: 'SSH 选项',
        sshOptionsDescription: "无命令行标志的 SSH 选项，参见 'man ssh'",
        ref: '引用',
        gitRemoteBranch: 'GIT 远程/分支',
        repo: '仓库',
        gitRemote: 'GIT 远程',
        path: '路径',
        pathInTheServer: '服务器中的路径',
        preSetup: '预设置',
        preSetupDescription: '预设置命令或本地机器上的脚本路径',
        postSetup: '后设置',
        postSetupDescription: '后设置命令或主机上的脚本路径',
        preDeployAction: '预部署操作',
        preDeployActionDescription: '预部署操作',
        postDeployAction: '后部署操作',
        postDeployActionDescription: '后部署操作'
    },

    descriptionBlade: {
        basicInformation: '基本信息',
        attributes: '属性',
        rpcs: 'RPCs',
        metrics: '指标',
        customEnvironmentVariables: '自定义环境变量',
        commonEnvironmentVariables: '通用环境变量',
        builtIn: '内置'
    },

    sendDataBlade: {
        sendData: '发送数据',
        data: '数据'
    },

    sendRpcBlade: {
        title: '远程过程调用 (RPC)',
        selectRpcName: '选择 RPC 名称',
        parameter: '参数'
    },

    sendSignalBlade: {
        sendSignal: '发送信号',
        selectSignalType: '选择信号类型'
    },

    terminalResultBlade: {
        deploymentResult: '部署结果'
    },

    userBlade: {
        createUser: '创建用户',
        updateUser: '更新用户',
        email: '邮箱',
        enabled: '已启用',
        superUser: '超级用户',
        avatar: '头像',
        displayName: '显示名称',
        password: '密码'
    },

    viewDataBlade: {
        title: '远程过程调用 (RPC)',
        data: '数据',
        response: '响应',
        undefined: '未定义'
    },

    dateTimePeriod: {
        days: '天',
        hours: '小时',
        minutes: '分钟',
        seconds: '秒',
        milliseconds: '毫秒'
    },

    environmentProfiles: {
        profiles: '配置',
        newProfile: '新建配置',
        active: '活跃',
        environmentVariables: '环境变量',
        addVariable: '+ 添加变量',
        variableKeyPlaceholder: 'VARIABLE_KEY',
        valuePlaceholder: '值',
        syncToAllProfiles: '同步到所有配置',
        duplicateProfile: '复制配置',
        noVariablesInThisProfile: '此配置中没有变量。',
        jsonStateTesting: 'JSON 状态（测试）'
    },

    fileSelector: {
        selectAFile: '选择文件',
        accessingFileSystem: '正在访问文件系统...',
        cancel: '取消',
        confirm: '确认',
        selectThisFolder: '选择此文件夹',
        preview: '预览：'
    },

    json5: {
        syntaxOk: '语法正确',
        syntaxError: '语法错误',
        prettify: '格式化'
    },

    logMonitor: {
        noActiveStreams: '没有活动的流。'
    },

    processSelector: {
        selectTheProcess: '选择进程',
        selectProcess: '选择进程'
    },

    stringList: {
        items: '项目',
        add: '添加',
        valuePlaceholder: '值...',
        listIsEmpty: '列表为空。'
    },

    tableFilterResult: {
        of: '/',
        rowsFiltered: '行已筛选。'
    },

    terminal: {
        processInspector: '进程检查器',
        success: '成功',
        timeout: '超时',
        exitCode: '退出代码：',
        chunks: '数据块'
    },

    utils: {
        day: '天',
        days: '天',
        hour: '小时',
        hours: '小时',
        minute: '分钟',
        minutes: '分钟',
        second: '秒',
        seconds: '秒',
        memoryUnits: {
            b: 'B',
            kb: 'KB',
            mb: 'MB',
            gb: 'GB'
        }
    },

    parameters: {
        groups: {
            general: '常规',
            advanced: '高级设置',
            static: '静态页面服务',
            logs: '日志文件',
            control: '控制流'
        },
        props: {
            name: {
                label: '应用名称',
                description: '应用程序的名称。默认为脚本文件名（不含扩展名）。'
            },
            script: {
                label: '脚本路径',
                description: '入口脚本的路径，相对于 PM2 启动命令的位置。'
            },
            cwd: {
                label: '工作目录',
                description: '应用程序启动时的当前工作目录 (CWD)。'
            },
            args: {
                label: '脚本参数',
                description: '传递给脚本的命令行参数字符串或列表。'
            },
            interpreter: {
                label: '解释器路径',
                description:
                    "解释器的绝对路径（如 Python 或二进制文件）。默认为 'node'。"
            },
            interpreter_args: {
                label: '解释器参数',
                description: '直接传递给解释器的标志或选项。'
            },
            node_args: {
                label: 'Node 参数',
                description: '解释器参数的别名。'
            },
            instances: {
                label: '实例数量',
                description:
                    '要启动的应用实例数量。0 将自动检测 CPU 核心数并以"集群"模式启动相应数量的实例。'
            },
            exec_mode: {
                label: '执行模式',
                description:
                    "启动应用的模式。选项：'cluster'（负载均衡）或 'fork'。默认为 'fork'。"
            },
            watch: {
                label: '监视并重启',
                description:
                    '启用监视功能。当目录中的文件发生更改时，应用会自动重新加载。'
            },
            ignore_watch: {
                label: '忽略监视列表',
                description: '要从文件监视功能中排除的字符串或正则表达式列表。'
            },
            max_memory_restart: {
                label: '最大内存重启',
                description:
                    "当应用超过指定内存限制时自动重启（如 '150M'、'2G'）。"
            },
            env: {
                label: '环境变量',
                description: '要注入应用进程的环境变量键值对。'
            },
            env_: {
                label: '自定义环境配置',
                description: '通过 --env 标志使用特定配置时注入的环境变量。'
            },
            appendEnvToName: {
                label: '将环境名附加到名称',
                description:
                    "启用后，将环境名称附加到应用名称（如 'app-production'）。"
            },
            source_map_support: {
                label: 'Source Map 支持',
                description:
                    '启用或禁用 JavaScript Source Map 支持以获得更好的错误堆栈跟踪。'
            },
            instance_var: {
                label: '实例 ID 变量',
                description: '重命名用于标识特定实例编号的环境变量。'
            },
            filter_env: {
                label: '环境过滤器',
                description: '用于防止特定全局变量进入进程的前缀列表。'
            },
            increment_var: {
                label: '递增变量',
                description: '为每个启动的实例递增一个环境变量。'
            },
            stop_exit_codes: {
                label: '停止退出代码',
                description: '不会触发应用重启的退出代码列表。'
            },
            exp_backoff_restart_delay: {
                label: '指数退避延迟',
                description: '以指数方式递增重启之间的时间间隔。设置 0 以禁用。'
            },
            servePath: {
                label: '静态文件路径',
                description: '静态文件服务的目录路径。'
            },
            servePort: {
                label: '静态文件端口',
                description: '静态文件服务的端口号。'
            },
            serveIsSpa: {
                label: '单页应用模式',
                description:
                    '为静态文件服务启用单页应用 (SPA) 模式。所有请求重定向到 index.html'
            },
            serveBasicAuth: {
                label: '基本认证',
                description: '为静态文件服务启用基本认证。'
            },
            serveBasicAuthUser: {
                label: '认证用户名',
                description: '静态文件服务基本认证的用户名。'
            },
            serveBasicAuthPassword: {
                label: '认证密码',
                description: '静态文件服务基本认证的密码。'
            },
            log_date_format: {
                label: '日志日期格式',
                description: '日志条目使用的时间戳格式。'
            },
            error_file: {
                label: '错误日志路径',
                description:
                    "存储错误日志 (stderr) 的文件路径。使用 '/dev/null' 禁用。"
            },
            out_file: {
                label: '输出日志路径',
                description:
                    "存储标准输出日志 (stdout) 的文件路径。使用 '/dev/null' 禁用。"
            },
            log_file: {
                label: '日志路径',
                description: 'stdout 和 stderr 日志的单一文件路径。'
            },
            combine_logs: {
                label: '禁用日志后缀',
                description: '启用后，阻止 PM2 在日志文件名后附加进程 ID。'
            },
            merge_logs: {
                label: '合并日志',
                description: '禁用日志后缀的别名'
            },
            time: {
                label: '日志时间戳',
                description: '启用后，自动在每行日志前添加时间戳。'
            },
            pid_file: {
                label: 'PID 文件路径',
                description: '存储进程 ID (PID) 文件的路径，用于监控。'
            },
            min_uptime: {
                label: '最小运行时间',
                description: '应用必须保持活动的时间才能被视为成功启动。'
            },
            listen_timeout: {
                label: '监听超时',
                description: '等待应用开始监听端口后强制重新加载的时间。'
            },
            kill_timeout: {
                label: '终止超时',
                description: '在停止信号后强制硬关闭 (SIGKILL) 前的宽限期。'
            },
            shutdown_with_message: {
                label: '通过消息关闭',
                description:
                    "使用 'shutdown' 消息代替系统信号以实现更受控的退出。"
            },
            wait_ready: {
                label: "等待 'Ready' 信号",
                description:
                    "等待应用手动发送 'ready' 信号，而不是等待网络端口。"
            },
            max_restarts: {
                label: '最大重启限制',
                description: 'PM2 停止尝试重启前允许的连续崩溃次数。'
            },
            restart_delay: {
                label: '重启延迟',
                description: '重启崩溃应用前等待的时间。'
            },
            autorestart: {
                label: '自动重启',
                description: '禁用后，PM2 在应用退出或崩溃时不会尝试重启。'
            },
            cron_restart: {
                label: '定时重启',
                description: '用于调度应用定期重启的 cron 表达式。'
            },
            vizion: {
                label: '版本控制元数据',
                description: '启用应用的版本控制功能 (Vizion)。'
            },
            post_update: {
                label: '更新后命令',
                description:
                    '通过 Keymetrics 仪表盘更新应用后执行的 shell 命令列表。'
            },
            force: {
                label: '强制启动',
                description: '允许同时启动同一脚本的多个实例。'
            }
        },
        components: {
            enable: '启用',
            value: '值',
            unit: '单位',
            watchForAllFiles: '监视所有文件',
            fork: 'Fork',
            cluster: '集群'
        }
    }
}
