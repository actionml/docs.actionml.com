DocList = [
    {
        title: 'Welcome to ActionML',
        template: 'welcome_to_actionml',
        sections: []       
    },{
        title: 'Harness ML/AI Server',
        template: 'harness_intro',
        sections: [
            {
                title: 'Install',
                template: 'harness_install'
            },
            {
                title: 'Debugging with IntelliJ',
                template: 'debugging_with_intellij'
            },
            {
                title: 'Security',
                template: 'harness_security'
            },
            {
                title: 'Users and Roles',
                template: 'users_and_roles'
            },
            {
                title: 'Upgrade',
                template: 'upgrading_from_pio_to_harness'
            },
         ]
    },{
        title: 'The Universal Recommender',
        template: 'ur',
        sections: [
            {
                title: 'Quickstart',
                template: 'ur_quickstart'
            },
            {
                title: 'Configuration',
                template: 'ur_config'
            },
            {
                title: 'Input',
                template: 'ur_input'
            },
            {
                title: 'Queries',
                template: 'ur_queries'
            },
            {
                title: 'Advanced Tuning',
                template: 'ur_advanced_tuning'
            },
            {
                title: 'Use Cases',
                template: 'ur_use_cases'
            },
            {
                title: 'Business Rules',
                template: 'ur_biz_rules'
            },
            {
                title: 'Model Debugging',
                template: 'ur_elasticsearch_debugging'
            },
            {
                title: 'UR Versions',
                template: 'ur_version_log'
            }
        ]
    },{
        title: 'PredictionIO',
        template: 'pio_by_actionml',
        sections: [
            {
                title: 'Quickstart',
                template: 'pio_quickstart'
            },
            {
                title: 'Upgrading',
                template: 'install'
            },
            {
                title: 'Architecure and Workflow',
                template: 'pio_architecture'
            },
            {
                title: 'Introduction to Spark',
                template: 'intro_to_spark'
            },
            {
                title: 'PIO + UR AWS AMI',
                template: 'awssetupguide'
            },
            {
                title: 'Single Machine Setup',
                template: 'single_machine'
            },
            {
                title: 'Small HA Cluster',
                template: 'small_ha_cluster'
            },
            {
                title: 'Distributed Cluster',
                template: 'single_driver_machine'
            },
            {
                title: 'Cheatsheet',
                template: 'pio_cli_cheatsheet'
            },
            {
                title: 'Start/Stop PIO',
                template: 'pio_start_stop'
            },
            {
                title: 'Version History',
                template: 'pio_versions'
            }
        ]
    },{
        title: 'Other Tools',
        template: 'actionml_tools',
        sections: [
            {
                title: 'Data Trim and Compress',
                template: 'db_cleaner_template'
            }
        ]
    }
];

DocListIndex = _(DocList).chain()
                         .zip(_(DocList).pluck('sections'))
                         .flatten()
                         .compact()
                         .pluck('template')
                         .value()