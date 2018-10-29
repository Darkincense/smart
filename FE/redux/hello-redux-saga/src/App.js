import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
     const props = {
      user: {
          posts: [
              { title: 'Foo', comments: [ 'Good one!', 'Interesting...' ] },
              { title: 'Bar', comments: [ 'Ok' ] },
              { title: 'Baz', comments: []}
          ],
          comments: []
      }
  }
  const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

  console.log(get(['user', 'posts', 0, 'comments'], props))
    return (
      <div>
       hello,xiaoyueyue!
      </div>
    );
  }
}

export default App;