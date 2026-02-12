FROM jenkins/jenkins:lts

# Install Docker CLI
USER root
RUN apt-get update && \
    apt-get install -y docker.io curl && \
    mkdir -p /usr/share/jenkins/.docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-linux-x86_64 -o /usr/share/jenkins/.docker/cli-plugins/docker-compose && \
    chmod +x /usr/share/jenkins/.docker/cli-plugins/docker-compose

# Add Jenkins user to Docker group
RUN usermod -aG docker jenkins
USER jenkins
