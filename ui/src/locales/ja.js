export default {
    common: {
        refresh: '更新',
        submit: '送信',
        create: '作成',
        update: '更新',
        delete: '削除',
        cancel: 'キャンセル',
        confirm: '確認',
        actions: '操作',
        columns: '列',
        name: '名前',
        email: 'メール',
        enabled: '有効',
        na: 'N/A',
        anonymous: '匿名',
        unmanaged: '未管理',
        required: '必須'
    },

    toast: {
        refreshedSuccessfully: '更新しました！',
        createdSuccessfully: '作成しました！',
        updatedSuccessfully: '更新しました！',
        deletedSuccessfully: '削除しました！',
        copiedSuccessfully: 'コピーしました！',
        sentSuccessfully: '送信しました！',
        downloadedSuccessfully: 'ダウンロードしました！',
        restoredSuccessfully: '復元しました！',
        uploadedSuccessfully: 'アップロードしました！',
        cleanedUpSuccessfully: 'クリーンアップしました！',
        managedSuccessfully: '管理設定しました！',
        restartedSuccessfully: '再起動しました！',
        reloadedSuccessfully: 'リロードしました！',
        stoppedSuccessfully: '停止しました！',
        startedSuccessfully: '起動しました！',
        duplicatedSuccessfully: '複製しました！'
    },

    error: {
        sessionExpired: 'セッションが期限切れです。',
        sessionExpiredDescription:
            'セッションが期限切れになりました。再度ログインしてください。',
        error: 'エラー。',
        anErrorOccurred: 'エラーが発生しました。',
        invalidCredentials: '認証情報が無効です。',
        invalidCredentialsDescription: '入力された認証情報は無効です。'
    },

    login: {
        title: 'ログイン',
        description:
            'ダッシュボードにアクセスするための認証情報を入力してください。',
        email: 'メール',
        password: 'パスワード',
        welcomeDescription:
            'ようこそ！ログインに成功しました。プロセスを管理できます。'
    },

    dashboard: {
        appName: 'PM2 UI',
        goTo: '移動...',
        nav: {
            home: 'ホーム',
            management: '管理',
            logs: 'ログ',
            metric: 'メトリック',
            communication: '通信',
            deployment: 'デプロイ',
            action: 'アクション',
            backup: 'バックアップ',
            settings: '設定',
            general: '一般',
            security: 'セキュリティ',
            database: 'データベース',
            administration: '管理',
            adminLog: '管理ログ',
            user: 'ユーザー'
        }
    },

    userMenu: {
        theme: 'テーマ',
        appearance: '外観',
        light: 'ライト',
        dark: 'ダーク',
        logOut: 'ログアウト',
        language: '言語'
    },

    stats: {
        totalCount: '合計数',
        runningCount: '実行中',
        stoppedCount: '停止中',
        totalRestartCount: '総再起動回数'
    },

    processList: {
        filterName: '名前で検索...',
        id: '#',
        name: '名前',
        script: 'スクリプト',
        status: 'ステータス',
        mode: 'モード',
        restartCount: '再起動回数',
        runPeriod: '実行時間',
        cpu: 'CPU',
        memory: 'メモリ',
        createdBy: '作成者',
        createTime: '作成日時',
        start: '起動',
        restart: '再起動',
        reload: 'リロード',
        stop: '停止',
        delete: '削除',
        editConfigurations: '設定を編集',
        manageConfiguration: '設定を管理',
        viewDescription: '説明を表示',
        copyConfigurationAsJson: '設定を JSON でコピー',
        duplicateConfiguration: '設定を複製',
        restartRequired: '再起動が必要'
    },

    action: {
        tabs: {
            process: 'プロセス',
            startup: 'スタートアップ',
            persist: '永続化',
            global: 'グローバル'
        },
        resetProcessRestartCounter: 'プロセス再起動カウンターをリセット',
        reset: 'リセット',
        clearLogFile: 'ログファイルをクリア',
        clear: 'クリア',
        generateStartupScript: 'スタートアップスクリプトを生成',
        startup: 'スタートアップ',
        generateUnstartupScript: 'アンスタートアップスクリプトを生成',
        unstartup: 'アンスタートアップ',
        saveProcesses: 'プロセスを保存',
        save: '保存',
        resurrectProcesses: 'プロセスを復元',
        resurrect: '復元',
        processesResurrectedWillBeUnmanaged:
            '復元されたプロセスは未管理状態になります',
        updateTheInMemoryPm2Daemon: 'メモリ内の PM2 デーモンを更新',
        killThePm2Daemon: 'PM2 デーモンを終了',
        kill: '終了',
        killWarning:
            'この操作後、すべての機能が停止し、すべての PM2 プロセスが削除されます',
        pingOrDaemonizedPm2: 'PM2 を ping またはデーモン化',
        ping: 'Ping',
        pingOrStartThePm2Daemon: 'PM2 デーモンを ping または起動',
        killTheDaemon: 'デーモンを終了'
    },

    adminLog: {
        filterAction: 'アクションで絞り込み',
        filterActions: 'アクションで絞り込み...',
        filterCategory: 'カテゴリで絞り込み',
        filterCategories: 'カテゴリで絞り込み...',
        filterStatus: 'ステータスで絞り込み',
        filterStatuses: 'ステータスで絞り込み...',
        filterResourceName: 'リソース名で絞り込み',
        filterResourceNamePlaceholder: 'リソース名で絞り込み...',
        id: '#',
        action: 'アクション',
        category: 'カテゴリ',
        status: 'ステータス',
        resourceName: 'リソース名',
        triggeredBy: '実行者',
        createTime: '作成日時',
        successful: '成功',
        failed: '失敗',
        viewResourceData: 'リソースデータを表示',
        resourceData: 'リソースデータ',
        actions: {
            callRpc: 'RPC 呼び出し',
            create: '作成',
            createAndStart: '作成して起動',
            delete: '削除',
            deploy: 'デプロイ',
            execute: '実行',
            flushLog: 'ログをフラッシュ',
            kill: '終了',
            logIn: 'ログイン',
            manage: '管理',
            ping: 'Ping',
            reload: 'リロード',
            regenerateKey: 'キーを再生成',
            resetCounter: 'カウンターをリセット',
            restart: '再起動',
            restore: '復元',
            resurrect: '復活',
            revert: '元に戻す',
            save: '保存',
            sendData: 'データ送信',
            sendSignal: 'シグナル送信',
            setup: 'セットアップ',
            start: '起動',
            stop: '停止',
            update: '更新',
            updatePm2: 'PM2 を更新',
            upgrade: 'アップグレード',
            upload: 'アップロード'
        },
        categories: {
            user: 'ユーザー',
            process: 'プロセス',
            setting: '設定',
            communication: '通信',
            cleanup: 'クリーンアップ',
            deployment: 'デプロイ',
            action: 'アクション',
            backup: 'バックアップ',
            globalSetting: 'グローバル設定'
        }
    },

    backup: {
        tabs: {
            backup: 'バックアップ',
            automaticBackup: '自動バックアップ'
        },
        createBackup: 'バックアップを作成',
        uploadBackupFile: 'バックアップファイルをアップロード',
        id: '#',
        name: '名前',
        size: 'サイズ',
        processCount: 'プロセス数',
        deploymentCount: 'デプロイ数',
        createdBy: '作成者',
        createTime: '作成日時',
        updateTime: '更新日時',
        automatically: '自動',
        download: 'ダウンロード',
        restore: '復元',
        edit: '編集',
        delete: '削除',
        enableAutomaticBackup: '自動バックアップを有効化',
        automaticBackupDescription: '毎日 00:00 に自動バックアップを実行',
        errorParsingFile: 'ファイル解析エラー'
    },

    communication: {
        send: '送信',
        filterType: 'タイプで絞り込み',
        filterTypePlaceholder: 'タイプで絞り込み...',
        filterName: '名前で絞り込み',
        filterNamePlaceholder: '名前で絞り込み...',
        id: '#',
        type: 'タイプ',
        name: '名前',
        triggeredBy: '実行者',
        createTime: '作成日時',
        updateTime: '更新日時',
        viewData: 'データを表示',
        types: {
            receiveData: 'データ受信',
            requestData: 'データ要求',
            rpc: 'RPC',
            sendSignal: 'シグナル送信'
        },
        sendActions: {
            sendSignal: 'シグナル送信',
            rpc: 'RPC',
            sendData: 'データ送信'
        }
    },

    deployment: {
        filterName: '名前で検索...',
        id: '#',
        name: '名前',
        user: 'ユーザー',
        repo: 'リポジトリ',
        createdBy: '作成者',
        createTime: '作成日時',
        updateTime: '更新日時',
        copyRawJson: '生の JSON をコピー',
        deleteItem: '項目を削除',
        editItem: '項目を編集',
        setup: 'セットアップ',
        deploy: 'デプロイ',
        update: '更新',
        revert: '元に戻す',
        revertNumber: '元に戻す番号',
        viewCurrent: '現在を表示',
        viewPrevious: '前回を表示',
        execute: '実行',
        command: 'コマンド',
        list: 'リスト'
    },

    log: {
        lineCount: '行数',
        autoRefresh: '自動更新',
        refreshLog: 'ログを更新',
        stdOut: '標準出力',
        stdErr: '標準エラー',
        combined: '統合'
    },

    metric: {
        enableMonitor: 'モニターを有効化',
        startTime: '開始時間',
        endTime: '終了時間',
        quickSelect: 'クイック選択',
        sampleDuration: 'サンプル間隔',
        selectMetric: 'メトリックを選択',
        aggregation: '集計',
        syncMetric: 'メトリックを同期',
        metricLabel: 'メトリック',
        resultsGenerated: '{count} 件の結果が生成されました。',
        aggregations: {
            average: '平均',
            minimum: '最小',
            maximum: '最大',
            sum: '合計',
            count: 'カウント'
        },
        quickTimes: {
            last5Minutes: '過去 5 分',
            last15Minutes: '過去 15 分',
            last30Minutes: '過去 30 分',
            last1Hour: '過去 1 時間',
            last3Hours: '過去 3 時間',
            last6Hours: '過去 6 時間',
            last12Hours: '過去 12 時間',
            last1Day: '過去 1 日',
            last2Days: '過去 2 日',
            last3Days: '過去 3 日',
            last7Days: '過去 7 日'
        }
    },

    general: {
        tabs: {
            subscription: 'サブスクリプション',
            monitor: 'モニター'
        },
        messageSubscriptions: 'メッセージサブスクリプション',
        watchOutThePerformance: 'パフォーマンスに注意',
        monitorIntervalOfDataCollection: 'モニターデータ収集間隔',
        maxSizeOfBufferedMonitorData:
            'バッファされたモニターデータの最大サイズ',
        maxAgeOfBufferedMonitorData: 'バッファされたモニターデータの最大期間'
    },

    security: {
        regenerateJwtPrivateKey: 'JWT 秘密鍵を再生成',
        thisForcesExistingUsersLoggingOut:
            '既存のログイン中のユーザーが強制ログアウトされます',
        regenerate: '再生成',
        tokenExpiration: 'トークン有効期限',
        loggedInUsersAreNotAffected: 'ログイン中のユーザーは影響を受けません',
        enableCors: 'CORS を有効化',
        willTakeEffectAfterRestartServer: 'サーバー再起動後に有効になります'
    },

    database: {
        tabs: {
            cleanup: 'クリーンアップ',
            automaticCleanup: '自動クリーンアップ'
        },
        expirationInfo: '有効期限情報',
        adminLogs: '管理ログ：{count} 件。',
        processSettings: 'プロセス設定：{count} 件。',
        communicationLogs: '通信ログ：{count} 件。',
        processMetrics: 'プロセスメトリック：{count} 件。',
        setExpirationTime: '有効期限を設定',
        cleanUpDatabase: 'データベースをクリーンアップ',
        cleanUp: 'クリーンアップ',
        enableAutomaticDatabaseCleanUp:
            '自動データベースクリーンアップを有効化',
        automaticCleanupDescription:
            '毎日午前 1:00 にデータベースの自動クリーンアップを実行'
    },

    user: {
        id: '#',
        email: 'メール',
        avatar: 'アバター',
        displayName: '表示名',
        enabled: '有効',
        superUser: 'スーパーユーザー',
        lastLogIn: '最終ログイン',
        createTime: '作成日時',
        updateTime: '更新日時',
        yourself: '自分',
        copyRawJson: '生の JSON をコピー',
        deleteItem: '項目を削除',
        editItem: '項目を編集',
        filterEmails: 'メールで検索...'
    },

    appBlade: {
        createProcess: 'プロセスを作成',
        updateProcessConfiguration: 'プロセス設定を更新',
        createAndRun: '作成して実行',
        create: '作成'
    },

    backupBlade: {
        createBackup: 'バックアップを作成',
        updateBackup: 'バックアップを更新',
        backupName: 'バックアップ名'
    },

    backupDownloadBlade: {
        downloadFile: 'ファイルをダウンロード',
        includeProcesses: 'プロセスを含める',
        includeDeployments: 'デプロイを含める',
        selectFileName: 'ファイル名を選択',
        selectDownloadType: 'ダウンロードタイプを選択',
        downloadTypes: {
            raw: 'Raw',
            json: 'JSON',
            commonJs: 'Common JS',
            esm: 'ESM'
        }
    },

    deploymentBlade: {
        createDeployment: 'デプロイを作成',
        updateDeployment: 'デプロイを更新',
        name: '名前',
        key: 'キー',
        sshKeyPath: 'SSH キーパス',
        user: 'ユーザー',
        sshUser: 'SSH ユーザー',
        hosts: 'ホスト',
        sshHosts: 'SSH ホスト',
        sshOptions: 'SSH オプション',
        sshOptionsDescription:
            "コマンドラインフラグなしの SSH オプション。'man ssh' を参照",
        ref: '参照',
        gitRemoteBranch: 'GIT リモート/ブランチ',
        repo: 'リポジトリ',
        gitRemote: 'GIT リモート',
        path: 'パス',
        pathInTheServer: 'サーバー内のパス',
        preSetup: 'プリセットアップ',
        preSetupDescription:
            'プリセットアップコマンドまたはローカルマシン上のスクリプトパス',
        postSetup: 'ポストセットアップ',
        postSetupDescription:
            'ポストセットアップコマンドまたはホストマシン上のスクリプトパス',
        preDeployAction: 'プリデプロイアクション',
        preDeployActionDescription: 'プリデプロイアクション',
        postDeployAction: 'ポストデプロイアクション',
        postDeployActionDescription: 'ポストデプロイアクション'
    },

    descriptionBlade: {
        basicInformation: '基本情報',
        attributes: '属性',
        rpcs: 'RPC',
        metrics: 'メトリック',
        customEnvironmentVariables: 'カスタム環境変数',
        commonEnvironmentVariables: '共通環境変数',
        builtIn: '組み込み'
    },

    sendDataBlade: {
        sendData: 'データを送信',
        data: 'データ'
    },

    sendRpcBlade: {
        title: 'リモートプロシージャコール (RPC)',
        selectRpcName: 'RPC 名を選択',
        parameter: 'パラメータ'
    },

    sendSignalBlade: {
        sendSignal: 'シグナルを送信',
        selectSignalType: 'シグナルタイプを選択'
    },

    terminalResultBlade: {
        deploymentResult: 'デプロイ結果'
    },

    userBlade: {
        createUser: 'ユーザーを作成',
        updateUser: 'ユーザーを更新',
        email: 'メール',
        enabled: '有効',
        superUser: 'スーパーユーザー',
        avatar: 'アバター',
        displayName: '表示名',
        password: 'パスワード'
    },

    viewDataBlade: {
        title: 'リモートプロシージャコール (RPC)',
        data: 'データ',
        response: 'レスポンス',
        undefined: '未定義'
    },

    dateTimePeriod: {
        days: '日',
        hours: '時間',
        minutes: '分',
        seconds: '秒',
        milliseconds: 'ミリ秒'
    },

    environmentProfiles: {
        profiles: 'プロファイル',
        newProfile: '新規プロファイル',
        active: 'アクティブ',
        environmentVariables: '環境変数',
        addVariable: '+ 変数を追加',
        variableKeyPlaceholder: 'VARIABLE_KEY',
        valuePlaceholder: '値',
        syncToAllProfiles: 'すべてのプロファイルに同期',
        duplicateProfile: 'プロファイルを複製',
        noVariablesInThisProfile: 'このプロファイルに変数はありません。',
        jsonStateTesting: 'JSON 状態（テスト）'
    },

    fileSelector: {
        selectAFile: 'ファイルを選択',
        accessingFileSystem: 'ファイルシステムにアクセス中...',
        cancel: 'キャンセル',
        confirm: '確認',
        selectThisFolder: 'このフォルダを選択',
        preview: 'プレビュー：'
    },

    json5: {
        syntaxOk: '構文 OK',
        syntaxError: '構文エラー',
        prettify: '整形'
    },

    logMonitor: {
        noActiveStreams: 'アクティブなストリームはありません。'
    },

    processSelector: {
        selectTheProcess: 'プロセスを選択',
        selectProcess: 'プロセスを選択'
    },

    stringList: {
        items: '項目',
        add: '追加',
        valuePlaceholder: '値...',
        listIsEmpty: 'リストは空です。'
    },

    tableFilterResult: {
        of: '/',
        rowsFiltered: '行がフィルタされました。'
    },

    terminal: {
        processInspector: 'プロセスインスペクター',
        success: '成功',
        timeout: 'タイムアウト',
        exitCode: '終了コード：',
        chunks: 'チャンク'
    },

    utils: {
        day: '日',
        days: '日',
        hour: '時間',
        hours: '時間',
        minute: '分',
        minutes: '分',
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
            general: '一般',
            advanced: '詳細設定',
            static: '静的ページ配信',
            logs: 'ログファイル',
            control: '制御フロー'
        },
        props: {
            name: {
                label: 'アプリケーション名',
                description:
                    'アプリケーションの名前。デフォルトはスクリプトファイル名（拡張子なし）。'
            },
            script: {
                label: 'スクリプトパス',
                description:
                    'PM2 起動コマンドの場所からの相対的なエントリポイントスクリプトのパス。'
            },
            cwd: {
                label: '作業ディレクトリ',
                description:
                    'アプリケーションが起動される際の現在の作業ディレクトリ (CWD)。'
            },
            args: {
                label: 'スクリプト引数',
                description:
                    'スクリプトに渡されるコマンドライン引数の文字列またはリスト。'
            },
            interpreter: {
                label: 'インタープリタパス',
                description:
                    "インタープリタの絶対パス（例：Python またはバイナリ）。デフォルトは 'node'。"
            },
            interpreter_args: {
                label: 'インタープリタ引数',
                description:
                    'インタープリタに直接渡されるフラグまたはオプション。'
            },
            node_args: {
                label: 'Node 引数',
                description: 'インタープリタ引数のエイリアス。'
            },
            instances: {
                label: 'インスタンス数',
                description:
                    '起動するアプリケーションインスタンスの数。0 は CPU コア数を自動検出し、「クラスター」モードで起動します。'
            },
            exec_mode: {
                label: '実行モード',
                description:
                    "アプリの起動モード。オプション：'cluster'（ロードバランス）または 'fork'。デフォルトは 'fork'。"
            },
            watch: {
                label: '監視して再起動',
                description:
                    '監視機能を有効にします。ディレクトリ内のファイルが変更されると、アプリが自動的にリロードされます。'
            },
            ignore_watch: {
                label: '監視除外リスト',
                description:
                    'ファイル監視機能から除外する文字列または正規表現パターンのリスト。'
            },
            max_memory_restart: {
                label: '最大メモリ再起動',
                description:
                    "指定されたメモリ制限を超えた場合にアプリを自動再起動します（例：'150M'、'2G'）。"
            },
            env: {
                label: '環境変数',
                description:
                    'アプリケーションプロセスに注入される環境変数のキーバリューペア。'
            },
            env_: {
                label: 'カスタム環境プロファイル',
                description:
                    '--env フラグで特定のプロファイルを使用する際に注入される環境変数。'
            },
            appendEnvToName: {
                label: '環境名を名前に追加',
                description:
                    "有効にすると、環境名をアプリケーション名に追加します（例：'app-production'）。"
            },
            source_map_support: {
                label: 'ソースマップサポート',
                description:
                    'より良いエラースタックトレースのためのJavaScript ソースマップサポートを有効/無効にします。'
            },
            instance_var: {
                label: 'インスタンス ID 変数',
                description:
                    '特定のインスタンス番号を識別する環境変数の名前を変更します。'
            },
            filter_env: {
                label: '環境フィルター',
                description:
                    '特定のグローバル変数がプロセスに入るのを防ぐプレフィックスのリスト。'
            },
            increment_var: {
                label: 'インクリメント変数',
                description:
                    '起動される各インスタンスの環境変数をインクリメントします。'
            },
            stop_exit_codes: {
                label: '停止終了コード',
                description:
                    'アプリケーションの再起動をトリガーしない終了コードのリスト。'
            },
            exp_backoff_restart_delay: {
                label: '指数バックオフ遅延',
                description:
                    '再起動間の時間を指数関数的に増加させます。0 で無効にします。'
            },
            servePath: {
                label: '静的ファイルパス',
                description: '静的ファイルが提供されるディレクトリパス。'
            },
            servePort: {
                label: '静的ファイルポート',
                description: '静的ファイルが提供されるポート番号。'
            },
            serveIsSpa: {
                label: 'SPA モード',
                description:
                    '静的ファイル配信のシングルページアプリケーション (SPA) モードを有効にします。すべてを index.html にリダイレクトします。'
            },
            serveBasicAuth: {
                label: 'ベーシック認証',
                description: '静的ファイル配信のベーシック認証を有効にします。'
            },
            serveBasicAuthUser: {
                label: '認証ユーザー名',
                description: '静的ファイル配信のベーシック認証のユーザー名。'
            },
            serveBasicAuthPassword: {
                label: '認証パスワード',
                description: '静的ファイル配信のベーシック認証のパスワード。'
            },
            log_date_format: {
                label: 'ログ日付フォーマット',
                description:
                    'ログエントリに使用されるタイムスタンプフォーマット。'
            },
            error_file: {
                label: 'エラーログパス',
                description:
                    "エラーログ (stderr) が保存されるファイルパス。無効にするには '/dev/null' を使用。"
            },
            out_file: {
                label: '出力ログパス',
                description:
                    "標準出力ログ (stdout) が保存されるファイルパス。無効にするには '/dev/null' を使用。"
            },
            log_file: {
                label: 'ログパス',
                description: 'stdout と stderr ログの単一ファイルパス。'
            },
            combine_logs: {
                label: 'ログサフィックスを無効化',
                description:
                    '有効にすると、PM2 がログファイル名にプロセス ID を追加するのを防ぎます。'
            },
            merge_logs: {
                label: 'ログを統合',
                description: 'ログサフィックスを無効化のエイリアス'
            },
            time: {
                label: 'ログタイムスタンプ',
                description:
                    '有効にすると、すべてのログ行にタイムスタンプを自動的に付加します。'
            },
            pid_file: {
                label: 'PID ファイルパス',
                description:
                    'プロセス ID (PID) ファイルが保存される監視用パス。'
            },
            min_uptime: {
                label: '最小稼働時間',
                description:
                    'アプリが正常に起動したと見なされるために必要な活動時間。'
            },
            listen_timeout: {
                label: 'リッスンタイムアウト',
                description:
                    'アプリがポートのリッスンを開始するまでの待機時間。超過すると強制リロード。'
            },
            kill_timeout: {
                label: '強制終了タイムアウト',
                description:
                    '停止シグナル後、強制シャットダウン (SIGKILL) までの猶予期間。'
            },
            shutdown_with_message: {
                label: 'メッセージによるシャットダウン',
                description:
                    "より制御されたシステム終了のために、システムシグナルの代わりに 'shutdown' メッセージを使用します。"
            },
            wait_ready: {
                label: "'Ready' シグナルを待機",
                description:
                    "ネットワークポートの代わりにアプリからの手動 'ready' シグナルを待ちます。"
            },
            max_restarts: {
                label: '最大再起動回数',
                description:
                    'PM2 が再起動の試行を停止するまでに許可される連続クラッシュ回数。'
            },
            restart_delay: {
                label: '再起動遅延',
                description:
                    'クラッシュしたアプリケーションを再起動するまでの待機時間。'
            },
            autorestart: {
                label: '自動再起動',
                description:
                    '無効にすると、PM2 はアプリが終了またはクラッシュした場合に再起動を試みません。'
            },
            cron_restart: {
                label: 'Cron スケジュール再起動',
                description:
                    'アプリケーションの定期的な再起動をスケジュールするための cron パターン。'
            },
            vizion: {
                label: 'バージョン管理メタデータ',
                description:
                    'アプリケーションのバージョン管理機能 (Vizion) を有効にします。'
            },
            post_update: {
                label: '更新後コマンド',
                description:
                    'Keymetrics ダッシュボード経由でアプリを更新した後に実行するシェルコマンドのリスト。'
            },
            force: {
                label: '強制起動',
                description:
                    '同じスクリプトの複数インスタンスの同時起動を許可します。'
            }
        },
        components: {
            enable: '有効',
            value: '値',
            unit: '単位',
            watchForAllFiles: 'すべてのファイルを監視',
            fork: 'フォーク',
            cluster: 'クラスター'
        }
    }
}
