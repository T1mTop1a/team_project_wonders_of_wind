import logo from './logo.svg';
import './App.css';

function App() {

  let appName = "Wonders of Wind"


  const getExampleData = async() =>{
    console.log('getting data');
    let response = await fetch(`${process.env.REACT_APP_BACKEND}/api/v1/example_response`);
    let json = await response.json();
    console.log(json);
  }

  return (
    <div className="App">
      <h1>{appName}</h1>
      <button onClick={getExampleData}>Get Example Data</button>
    </div>
  );
}

export default App;
