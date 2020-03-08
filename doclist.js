DocList = [
    {
        title: 'Welcome to ActionML',
        template: 'welcome_to_actionml',
        sections: []       
    },{
        title: 'Harness',
        template: 'harness_intro',
        sections: [
            {
                title: 'Overview',
                template: 'harness_overview'
            },
            {
                title: 'Architecture',
                template: 'harness_architecture'
            },
            {
                title: 'Commands',
                template: 'h_commands'
            },
            {
                title: 'Learning Styles',
                template: 'learning_styles'
            },
            {
                title: 'Workflow',
                template: 'h_workflow'
            },
            {
                title: 'REST Specification',
                template: 'h_rest_spec'
            },
            {
                title: 'Configuration',
                template: 'harness_config'
            },
            {
                title: 'Container Installation Quickstart',
                template: 'harness_container_guide'
            },
            {
                title: 'Source Install',
                template: 'harness_install'
            },
            {
                title: 'Kubernetes Installation',
                template: 'harness_kubernetes'
            },
            {
                title: 'Native Installation',
                template: 'harness_native_guide'
            },
            {
                title: 'Mirroring',
                template: 'h_mirroring'
            },
            {
                title: 'Security',
                template: 'harness_security'
            },
            {
                title: 'Introduction to Spark',
                template: 'intro_to_spark'
            },
            {
                title: 'Users and Roles',
                template: 'users_and_roles'
            },
            {
                title: 'Upgrade from PIO',
                template: 'upgrading_from_pio_to_harness'
            },
            {
                title: 'Debugging with IntelliJ',
                template: 'debugging_with_intellij'
            },
            {
                title: 'Release Notes',
                template: 'release_notes'
            }
         ]
    },{
        title: 'The Universal Recommender',
        template: 'h_ur',
        sections: [
            {
                title: 'Quickstart',
                template: 'h_ur_quickstart'
            },
            {
                title: 'Configuration',
                template: 'h_ur_config'
            },
            {
                title: 'Input',
                template: 'h_ur_input'
            },
            {
                title: 'Queries',
                template: 'h_ur_queries'
            },
            {
                title: 'Workflow',
                template: 'h_workflow'
            },
            {
                title: 'Shopping Cart',
                template: 'h_ur_complementary_items'
            },
            {
                title: 'Advanced Tuning',
                template: 'h_ur_advanced_tuning'
            },
            {
                title: 'Use Cases',
                template: 'h_ur_use_cases'
            },
            {
                title: 'Business Rules',
                template: 'h_ur_biz_rules'
            },
            {
                title: 'Debugging with Elasticsearch',
                template: 'h_ur_debugging_with_elasticsearch'
            },
            {
                title: 'UR Versions',
                template: 'h_ur_version_log'
            }
        ]
    },{
        title: 'PredictionIO (legacy)',
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
        title: 'The PredictionIO Universal Recommender (legacy)',
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