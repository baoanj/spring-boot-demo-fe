import { $e, $v, messageBox } from './utils.js';

$e('#open-contact-ws-jms').onclick = () => {
  const ws = new WebSocket(`ws://${location.host}/api/ws/jms`);
  const stomp = Stomp.over(ws);

  stomp.connect({}, frame => {
    stomp.subscribe("/topic/newContact", message => {
      messageBox(message.body + '提交了新的Contact');
    });
  }, err => {
    console.log(err);
    messageBox(err);
  });

  $e('#close-contact-ws-jms').onclick = () => {
    stomp.disconnect();
    ws.close();
  };
};

$e('#open-contact-ws-amqp').onclick = () => {
  const ws = new WebSocket(`ws://${location.host}/api/ws/amqp`);
  const stomp = Stomp.over(ws);

  stomp.connect({}, frame => {
    stomp.subscribe("/topic/newContact", message => {
      messageBox(message.body + '提交了新的Contact');
    });
    stomp.subscribe("/user/topic/newContact", message => {
      messageBox(message.body + '提交了新的Contact');
    });
  }, err => {
    console.log(err);
    messageBox(err);
  });

  $e('#close-contact-ws-amqp').onclick = () => {
    stomp.disconnect();
    ws.close();
  };
};

$e('#open-simple-ws').onclick = () => {
  const ws = new WebSocket(`ws://${location.host}/api/ws/simple`);

  ws.onopen = () => {
    $e('#simple-ws-status').innerHTML = '开启中';
    console.log('Simple WebSocket Open!');
  };

  ws.onmessage = e => {
    try {
      const response = JSON.parse(e.data);
      appendChatMsg(`Receive: ${response.message} - ${new Date(response.time)
        .toLocaleString()} - ${response.sendUser}`);
    } catch (err) {
      messageBox(e.data);
    }
  };

  ws.onerror = error => {
    console.log(error);
  };

  ws.onclose = () => {
    $e('#simple-ws-status').innerHTML = '关闭了';
    console.log('Simple WebSocket Close!');
  };

  $e('#simple-ws-send').onclick = () => {
    if (ws.readyState === ws.OPEN) {
      const receiveUsers = $v('#simple-ws-receive-users').split(' ');
      const sendMsg = { message: $v('#simple-ws-msg'), time: Date.now(), receiveUsers };
      ws.send(JSON.stringify(sendMsg));
      appendChatMsg(`Send: ${sendMsg.message} - ${new Date(sendMsg.time)
        .toLocaleString()} - 我`);
    }
  };

  $e('#simple-ws-close').onclick = () => {
    ws.close();
  };

  function appendChatMsg(msg) {
    const liElm = document.createElement('li');
    liElm.innerHTML = msg;
    $e('#simple-ws-receive').appendChild(liElm);
  }
};

$e('#open-stomp-ws').onclick = () => {
  const ws = new WebSocket(`ws://${location.host}/api/ws/stomp`);
  const stomp = Stomp.over(ws);

  stomp.connect({}, frame => {
    $e('#stomp-ws-status').innerHTML = '开启中';
    stomp.subscribe("/user/topic/polo", handlePolo);
  }, err => {
    console.log(err);
  });

  function handlePolo(message) {
    const response = JSON.parse(message.body);
    appendChatMsg(`Receive: ${response.message} - ${new Date(response.time)
      .toLocaleString()} - ${response.sendUser}`);
  }

  $e('#stomp-ws-send').onclick = () => {
    if (stomp.connected) {
      const receiveUsers = $v('#stomp-ws-receive-users').split(' ');
      const sendMsg = { message: $v('#stomp-ws-msg'), time: Date.now(), receiveUsers };
      stomp.send("/app/marco", {}, JSON.stringify(sendMsg));
      appendChatMsg(`Send: ${sendMsg.message} - ${new Date(sendMsg.time)
        .toLocaleString()} - 我`);
    }
  };

  $e('#stomp-ws-close').onclick = () => {
    stomp.disconnect();
    ws.close();
    $e('#stomp-ws-status').innerHTML = '关闭了';
  };

  function appendChatMsg(msg) {
    const liElm = document.createElement('li');
    liElm.innerHTML = msg;
    $e('#stomp-ws-receive').appendChild(liElm);
  }
};
