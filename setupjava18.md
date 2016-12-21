
 1. Install Java OpenJDK or Oracle JDK for Java 7 or 8, the JRE version is not sufficient.

    ```
    sudo apt-get install openjdk-8-jdk
    # for centos
    # sudo yum install java-1.8.0-openjdk
    ```
 
    - **Note**: on Centos/RHEL you may need to install java-1.8.0-openjdk-devel if you get complaints about missing `javac` or `javadoc`

 2. Check which versions of Java are installed and pick a 1.7 or greater.

    ```
    sudo update-alternatives --config java
    ```

 3. Set JAVA_HOME env var. Don't include the `/bin` folder in the path. This can be problematic so if you get complaints about JAVA\_HOME you may need to change xxx-env.sh depending on which service complains. For instance `hbase-env.sh` has a JAVA\_HOME setting if HBase complains when starting.

    ```
    vim /etc/environment
    # add the following
    export JAVA_HOME=/path/to/open/jdk/jre
    # some would rather add JAVA_HOME to /home/aml/.bashrc
    ```
