# Harness Container Quickstart

<a href="https://www.docker.com" target="_blank"><img src="images/docker-logo.png"/></a>

This guides you through deployment of Harness Server and CLI using published Docker containers with simple Docker-compose container management. This project is typically used as a quickstart in proof-of-concept type settings, not for high demand scalable production deployments.

[Contact ActionML](/#contact) other deployment options.

# Harness + UR

**Note**: this quickstart uses Harness-0.5.0-SNAPSHOT, which is in pre-release form and not recommended for production.

With Docker Compose, Harness and all dependent services run in Docker Containers, even the harness-cli is installed in its own container. This makes it very simple to install on a single machine or VM but is generally not sufficient for a high-demand production system.

The containers, by default, run in the following configuration:

![](https://docs.google.com/drawings/d/e/2PACX-1vQocPhRrFn1TJAeWdcr2v9oD7_T9C261DLTwqueoESuubOcQtk1Iv7KZt6M7sSdvqocl8fSvtU6bf_K/pub?w=1193&h=758)

# Prerequisites

It is good to become familiar with Docker and Docker Compose and how they work. We do not document them exhaustively here. Harness uses multiple containers and so is more complex than single container deployments.

On the machine you want to host Harness, install:

 - <a href="https://docs.docker.com/install/" target="_blank">Docker tools</a>
 - <a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose</a>
 - Git for <a href="https://help.github.com/en/articles/set-up-git" target="_blank">GitHub</a>

## One-line Install of Harness + UR

If you are familiar with Docker and Docker Compose, here is our "one-liner":

```git clone https://github.com/actionml/harness-docker-compose.git && cd harness-docker-compose && cp .env.sample .env && docker-compose up -d --build```

At this point Harness and the UR are running on [`http://localhost:9090`](http://localhost:9090). Following the URL or executing `curl localhost:9090` should display `OK`. `harness-cli` can be used by logging in to the harness-cli container. Read on for more about operating the system.

**Note:** this method for running Harness puts all dependencies in containers, so MongoDB and Elasticsearch are **not** installed natively on the host. If you already have these services on the host, extra care must be taken that they do not conflict with container versions. We suggest you shut down host installed Mongo and Elasticsearch while running container versions.

# Detailed Installation

## Configure

The composed containers can be customized via changes to `.env` or `docker-compose.yml`

 - mapping host filesystem to container filesystem. By default containers have no persistent files and sill loose state if they do not have some portion of the host filesystem to use.
 - change the environment passed to containers when they are launched. 

 - `cd harness-docker-compose`
 - `cp .sample.env .env`
 - edit `docker-compose.yml` or `.env` if the defaults are not adequate. 

One important thing to note is that in order to access files for `harness-cli import ...` or `harness-cli add <some-engine.json>` the file(s) must be accessible from the Harness Server or from the cli. By default we map a directory into the filesystems of both the harness and harness-cli containers:

![](https://docs.google.com/drawings/d/e/2PACX-1vQFb4EfmP6Ocy1UxjqBd8bVPFVumIIY_vrgDO8i5zvmrvwporCpG2O3L9ZKhsiZl3N0zO_SWKuFZ4Nt/pub?w=1123&h=271)

## Launch all Containers

With the docker tools installed:

 - `docker-compose up -d --build` for first time setup

Once deployed one or more containers in the collection can be updated. It is best to explore the docker-compose cli and options as well as docker commands. Some useful commands for updates are:
 
 - `docker-compose down` stops all container in the local yaml file. Do this before any other docker-compose updates.
 - `git pull origin <branch>` for this repo the lastest vesion under test is in branch `develop`, the last stable release is in `master`. The `git` repo contains the latest project structure and `coker-compose.yml`.
 - `docker-compose pull` this will get all updated containers that are available.
 - `docker-compose up -d --build --force-recreate` to bring up all updated containers by recreating all images.

## Operations

Once installed the containers work somewhat like a cluster of virtual machines all running on a single host. You can login to them, examine logs, and start and stop them.

 - **Logs**: Harness logs are in the `docker-persistence/harness/...` directory and can be `tail`ed on the host as any local log file. Other containers may have logs available by using:

    `docker-compose logs <some-container-id>`

 - **Monitoring**: Simple monitoring can be done by looking at memory, disk and CPU usage since all containers are running on the host. To get more granular several tools allow monitoring individual containers.

## Files and Container Persistence

The way Docker supports a composed filesystem uses a mapping of container internal filesystem to the host's filesystem. By default they will appear in `harness-docker-compose/docker-persistence/...` Be careful with these files, they will contain data for the database and elasticsearch so deleting them will destroy all data in Harness.

## Harness CLI

The Harness-CLI is also started in a container. To use it, log-in.

 - `docker-compose exec harness-cli bash`

    This starts a `bash` shell in the container, configured to communicate with the Harness container
    
 - `docker-compose exec harness-cli bash -c 'harness-cli status'`

    this will return the status of Harness

## Native Installation of the Harness-CLI

The [harness-cli](https://github.com/actionml/harness-cli) can also be installed on the host OS as desired. It uses the REST API to control Harness and so can be on any host.

This method requires more prerequisites on the host but can be more convenient than using the harness-cli container.

# Kubernetes

For fully scalable, clustered deployment of a high demand Harness (+ UR) system we maintain a customizable Kubernetes project that is flexible enough for just about any type of deployment. Because it requires customization, this is not supported as OSS, [contact us](/#contact) if you'd like more information

# Related Projects

These projects are related and can be used together:

 1. [Harness Server Docker Image](https://hub.docker.com/r/actionml/harness) Use tag `latest` for the current latest stable release. Use `develop` for the current work-in-progress of the next release.
 2. [Harness-CLI Docker Image](https://hub.docker.com/r/actionml/harness-cli) The client command line interface for Harness. 
 3. [Harness Server](https://github.com/actionml/harness) This is the source code for building from source, not needed for container usage.
 4. Harness [CLI and SDK](https://github.com/actionml/harness-cli) Used to execute `harness-cli` or create Python clients.
 5. Harness [Java/Scala Client SDK](https://github.com/actionml/harness-java-sdk) Useful for Java and Scala clients.
 6. The [Harness Auth-Server](https://github.com/actionml/harness-auth-server) **Not required and not described here, see this [README](https://github.com/actionml/harness-auth-server) if you want to use the harness-auth-server**

