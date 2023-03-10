FROM ubuntu:latest
CMD ["bash"]
RUN apt update -y && apt upgrade -y && apt install wget git nodejs npm -y && apt clean
WORKDIR /root
USER root
RUN git clone https://github.com/MyEcoria/guessTheNumber.git guess
WORKDIR /root/guess
RUN npm install
ENTRYPOINT node server.js
