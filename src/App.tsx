import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { List } from "./pages/list/List";
import "./App.scss";
import { Detail } from "./pages/detail/Detail";
import { Battle } from "./pages/battle/Battle";

function App() {
    return (
        <Router>
            <div>
                {/* <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/topics">Topics</Link>
                    </li>
                </ul> */}

                <Routes>
                    <Route path="*" element={<List />} />

                    <Route path="/" element={<List />} />

                    <Route path={`detail`} element={<Detail />} />
                    <Route path="battle" element={<Battle />} />
                </Routes>
                {/* <Routes path="*" element={<List />} /> */}
            </div>
        </Router>
    );
}

export default App;
