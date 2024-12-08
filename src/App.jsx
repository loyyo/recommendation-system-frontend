import {useEffect, useState} from "react";
import "./App.css";

function App() {
    const [currentTab, setCurrentTab] = useState("Empty");
    const [userId, setUserId] = useState(1);
    const [userIds, setUserIds] = useState({ user_ids: []});
    const [userData, setUserData] = useState([]);
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = "http://127.0.0.1:8000/api";

    async function fetchData(endpoint) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    }

    useEffect(() => {
        if (currentTab === "Users" && userIds.user_ids.length === 0) {
            fetchData("users/ids")
                .then(value => {
                    console.log(value)
                    setUserIds(value);
                })
                .catch((err) => console.error("Failed to fetch user ids:", err));
        }
    }, [currentTab, userIds]);

    useEffect(() => {
        if (currentTab === "Products" && products.length === 0) {
            fetchData("products")
                .then(setProducts)
                .catch((err) => console.error("Failed to fetch products:", err));
        }
    }, [currentTab, products]);

    const fetchRecommendations = () => {
        setLoading(true);
        fetchData(`recommendations/${userId}`)
            .then((data) => {
                setRecommendations(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch recommendations:", err);
                setLoading(false);
            });
    };

    const fetchUserData = () => {
        setLoading(true);
        fetchData(`users/${userId}`)
            .then((data) => {
                setUserData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch user data:", err);
                setLoading(false);
            });
    };

    // Render based on the current tab
    const renderContent = () => {
        if (currentTab === "Empty") {
            return (
                <div>
                    Wybierz jedną z powyższych zakładek
                </div>
            )
        }
        if (currentTab === "Users") {
            return (
                <div className="user-tab">
                    <h2>User Interactions</h2>
                    <div className="user-select">
                        <label htmlFor="user-select">Select User: </label>
                        <select
                            id="user-select"
                            value={userId}
                            onChange={(e) => {
                                setUserId(Number(e.target.value))
                            }}
                        >
                            {userIds.user_ids.map((user_id) => (
                                <option key={user_id} value={user_id}>
                                    User {user_id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={fetchUserData} disabled={loading}>
                        {loading ? "Loading..." : "Get User Interaction History"}
                    </button>

                    {userData && userData.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                            <th>Product ID</th>
                                <th>Interaction</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userData.map((rec) => (
                                <tr key={rec.product_id}>
                                    <td>{rec.product_id}</td>
                                    <td>{rec.interaction}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-10px">No interaction history available for this user.</p>
                    )}
                </div>
            );
        }

        if (currentTab === "Products") {
            return (
                <div className="product-tab">
                    <h2>Products</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.product_id}>
                                <td>{product.product_id}</td>
                                <td>{product.product_description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (currentTab === "Recommendations") {
            return (
                <div className="recommendations-tab">
                    <h2>Recommendations</h2>
                    <div className="user-select">
                        <label htmlFor="user-select">Select User: </label>
                        <select
                            id="user-select"
                            value={userId}
                            onChange={(e) => setUserId(Number(e.target.value))}
                        >
                            {userIds.user_ids.map((user_id) => (
                                <option key={user_id} value={user_id}>
                                    User {user_id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={fetchRecommendations} disabled={loading}>
                        {loading ? "Loading..." : "Get Recommendations"}
                    </button>
                    {recommendations.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Description</th>
                                <th>Recommendation Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recommendations.map((rec) => (
                                <tr key={rec.product_id}>
                                    <td>{rec.product_id}</td>
                                    <td>{rec.product_description}</td>
                                    <td>{rec.recommendation_value.toFixed(3)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-10px">No recommendations available for this user.</p>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="App">
            <header>
                <h1>Recommendation System</h1>
            </header>
            <nav>
                <button onClick={() => setCurrentTab("Users")}>Users</button>
                <button onClick={() => setCurrentTab("Products")}>Products</button>
                <button onClick={() => setCurrentTab("Recommendations")}>Recommendations</button>
            </nav>
            <main>{renderContent()}</main>
        </div>
    );
}

export default App;
