var api = {

  getUser(uid) {
    var url = `https://relate-chat.firebaseio.com/users/${uid}.json`;
    return fetch(url)
      .then((res) => {
        return res.json();
      });
  },
  // old getUser before auth and still using username instead of uid
  // getUser(username) {
  //   username = username.toLowerCase().trim();
  //   //var url = `https://api.github.com/users/${username}`;
  //   var url = `https://relate-chat.firebaseio.com/users/${username}.json`;
  //   return fetch(url)
  //     .then((res) => {
  //       return res.json();
  //     });
  // },
  getRelaters() {
    var url = `https://relate-chat.firebaseio.com/relaters.json`;
    return fetch(url)
      .then((res) => {
        console.log(res);
        return res.json();
      })
  },
  getMessages(uid) {
    var url = `https://relate-chat.firebaseio.com/messages/${uid}.json`;
    return fetch(url)
      .then((res) => {
        console.log("these should be the messages: ", res);
        return res.json();
      });
  },
  // old getMessages (before auth and using uid to represent user)
  // getMessages(username) {
  //   var url = `https://relate-chat.firebaseio.com/messages/${username}.json`;
  //   return fetch(url)
  //     .then((res) => {
  //       console.log("these should be the messages: ", res);
  //       return res.json();
  //     });
  // },
  setRelater(uid, relater) {
    console.log("lets set the relater on this user: ", uid);
    var url = `https://relate-chat.firebaseio.com/users/${uid}.json`;
    return fetch(url, {
      method: 'patch',
      body: JSON.stringify({relater: relater})
    }).then((res) => {
      console.log("this is what setRelater returns, it should be the user that now has selected the relater: ", res);
      return res.json() });
  },
  // old setRelater
  // setRelater(username, relater) {
  //   console.log("lets set the relater on this user: ", username);
  //   username = username.toLowerCase().trim();
  //   var url = `https://relate-chat.firebaseio.com/users/${username}.json`;
  //   return fetch(url, {
  //     method: 'put',
  //     body: JSON.stringify({relater: relater})
  //   }).then((res) => {
  //     console.log("this is what setRelater returns, it should be the user that now has selected the relater: ", res);
  //     return res.json() });
  // },
  addUser(username) {
    username = username.toLowerCase().trim();
    var url = `https://relate-chat.firebaseio.com/users/${username}.json`;
    return fetch(url, { method: 'post' })
      .then((res) => { return res.json(); });
  },
  addMessage(relater, name, message, timestamp, uid) { // changing from username to name, also adding uid
    //username = username.toLowerCase().trim();
    var url = `https://relate-chat.firebaseio.com/messages/${uid}.json`; // changing from username to uid
    return fetch(url, {
      method: 'post',
      body: JSON.stringify({
        receiver: relater,
        sender: name, // changing from username to name
        text: message,
        timestamp: timestamp
      })
    })
      .then((res) => { return res.json(); });
  },
  createUser(uid, email, firstname) {
    console.log("lets create the user: ", firstname);
    firstname = firstname.toLowerCase().trim();
    var url = `https://relate-chat.firebaseio.com/users/${uid}.json`;
    return fetch(url, {
      method: 'put',
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // },
      body: JSON.stringify({name: firstname, email: email })
      // payload: 'johnny'
    }).then((res) => {
      console.log("will this work with: ", res);
      return res.json() } );
  },
  // Old create user api call
  // createUser(username) {
  //   console.log("lets create the user: ", username);
  //   username = username.toLowerCase().trim();
  //   var url = `https://relate-chat.firebaseio.com/users/${username}.json`;
  //   return fetch(url, {
  //     method: 'put',
  //     // headers: {
  //     //   'Accept': 'application/json',
  //     //   'Content-Type': 'application/json'
  //     // },
  //     body: JSON.stringify({name: 'Duder', handle: username })
  //     // payload: 'johnny'
  //   }).then((res) => {
  //     console.log("will this work with: ", res);
  //     return res.json() } );
  // },
  updateUser(username) {
    console.log("lets update this user:", username);
    username = username.toLowerCase().trim();
    var url = `https://relate-chat.firebaseio.com/users/${username}.json`;
    return fetch(url, {
      method: 'put',
      body: JSON.stringify({name: 'Johnny Ten'})
    }).then((res) => {
      console.log("will this work with: ", res);
      return res.json() } );
  }

};

export default api;
