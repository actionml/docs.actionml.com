
Download everything to a temp folder like `/tmp/downloads`, we will later move them to the final destinations. **Note**: You may need to install `wget` with `yum` or `apt-get`.

 1. Download:

    - {{> hdfsdownload}}

    - {{> sparkdownload}}

    - {{> esdownload}}

    - {{> hbasedownload}}

 2. Clone {{> pioname}} from its root repo into `~/pio`

    ```
    git clone https://github.com/actionml/PredictionIO.git pio
    cd ~/pio
    git checkout master #get the latest stable version
    ```

 3. Clone Universal Recommender Template from its root repo into `~/universal` or do similar for any other template.

    ```
    git clone https://github.com/actionml/universal-recommender.git ur
    cd ~/ur
    git checkout master # or get the tag you want
    ```
