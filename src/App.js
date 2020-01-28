import React from "react";
import logo from "./logo.svg";
import "./App.css";

export class NavBar extends React.Component {
    state = {};
    render() {
        return (
            <nav
                className="navbar is-danger"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <a className="navbar-item" href="/about.html">
                        <img
                            src="NobodysOpinion_icon.png"
                            width="30"
                            height="30"
                        />
                    </a>

                    <a
                        role="button"
                        className="navbar-burger burger"
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarBasicExample"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <a className="navbar-item">Home</a>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-item field has-addons">
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="Search for restaurants"
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

class HeaderText extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="title is-1" style={{ textAlign: "center" }}>
                    [Site Title]
                </h1>
                <p className="subtitle" style={{ textAlign: "center" }}>
                    A truly anonymous way to rate and review restaurants
                </p>
            </React.Fragment>
        );
    }
}

class Search extends React.Component {
    constructor() {
        super();
        this.onSubmit = this.onSubmit.bind(this);
        this.checkEnter = this.checkEnter.bind(this);
        this.saveCoords = this.saveCoords.bind(this);
    }

    state = {
        userInput: null,
        lat: null,
        long: null
    };

    onSubmit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.saveCoords);
        }
        let newInput = document.getElementById("searchInput").value;
        // if userInput is empty, error message
        if (newInput.length == 0) {
            return;
        } else {
            this.setState({ userInput: newInput });
            console.log(newInput);
        }
    }

    saveCoords(position) {
        this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude
        });
    }

    checkEnter(e) {
        if (e.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        let search = null;
        if (
            this.state.userInput !== null &&
            this.state.userInput.length > 0 &&
            this.state.lat &&
            this.state.lon
        ) {
            search = (
                <SearchResults
                    query={this.state.userInput}
                    lat={this.state.lat}
                    lon={this.state.lon}
                />
            );
        }
        return (
            <React.Fragment>
                <section className="section">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-half">
                                <HeaderText />
                                <div className="field has-addons has-addons-centered">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            id="searchInput"
                                            placeholder="Search for restaurants"
                                            onKeyPress={this.checkEnter}
                                        />
                                    </div>
                                    <div className="control">
                                        <a
                                            className="button is-info"
                                            onClick={this.onSubmit}
                                        >
                                            Search
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="container"
                                    style={{ textAlign: "center" }}
                                >
                                    <button className="button">
                                        Show local restaurants
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {search}
            </React.Fragment>
        );
    }
}

class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.getResultsServer = this.getResultsServer.bind(this);
        this.clickCard = this.clickCard.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.getResultsServer(this.props.query, this.props.lat, this.props.lon);
    }

    state = {
        allResults: {},
        displayModal: false,
        modalData: {}
    };

    getResultsServer(query, lat, lon) {
        console.log("Request sent");
        let BASE_URL =
            "https://4jb0iea9tb.execute-api.us-west-2.amazonaws.com/prod/search?";
        let FULL_URL =
            BASE_URL +
            "query=" +
            query +
            "&lat=" +
            lat.toString() +
            "&lon=" +
            lon.toString();
        fetch(FULL_URL, {
            method: "GET",
            mode: "cors"
        })
            .then(Response => {
                return Response.json();
            })
            .then(jsonData => {
                console.log(jsonData);
                this.setState({ allResults: jsonData });
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.query !== this.props.query) {
            this.getResultsServer(
                this.props.query,
                this.props.lat,
                this.props.lon
            );
        }
    }

    clickCard(data) {
        console.log("Open clicked...");
        console.log("DATA", data);
        this.setState({ modalData: data });
        this.setState({ displayModal: true });
        document.getElementById("html").classList.add("is-clipped");
        console.log(this.state.displayModal);
    }

    closeModal() {
        console.log("Close clicked...");
        this.setState({ displayModal: false });
        document.getElementById("html").classList.remove("is-clipped");
    }

    render() {
        let rowsDisplay = null;
        if (this.state.allResults.restaurants) {
            let restaurants = this.state.allResults.restaurants;
            let rows = [];
            //console.log(restaurants.length);

            // Display 4 restaurants at a time
            let toDisplay = [];
            for (let i = 0; i < restaurants.length; i++) {
                toDisplay.push(restaurants[i]);
                // Clear display array after 4 filled
                if (toDisplay.length % 4 == 0) {
                    rows.push(
                        <ResultRow
                            key={i}
                            toDisplay={toDisplay}
                            clickCard={this.clickCard}
                        />
                    );
                    toDisplay = [];
                }
            }
            if (rows.length == 0) {
                rows.push(
                    <ResultRow
                        key={0}
                        toDisplay={restaurants}
                        clickCard={this.clickCard}
                    />
                );
            }
            rowsDisplay = <React.Fragment>{rows}</React.Fragment>;
        }
        return (
            <section className="section">
                <Modal
                    active={this.state.displayModal}
                    closeModal={this.closeModal}
                    data={this.state.modalData}
                />
                <div className="container">
                    <h1 className="title">
                        Search results: {this.props.query}{" "}
                    </h1>
                    {rowsDisplay}
                </div>
            </section>
        );
    }
}

class ResultRow extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {};
    render() {
        let cards = [];
        for (let i = 0; i < this.props.toDisplay.length; i++) {
            cards.push(
                <ResultCard
                    key={i}
                    restaurant={this.props.toDisplay[i]}
                    clickCard={this.props.clickCard}
                />
            );
        }
        return <div className="columns">{cards}</div>;
    }
}

class ResultCard extends React.Component {
    constructor(props) {
        super(props);
        // this.props.clickCard = this.props.clickCard.bind(this);
    }

    render() {
        let restaurant = this.props.restaurant.restaurant;
        // console.log(restaurant);
        let photo = "https://bulma.io/images/placeholders/1280x960.png";
        if (restaurant.photos) {
            photo = restaurant.photos[0].photo.url;
        }
        return (
            <div className="column">
                <div className="card">
                    <div className="card-image">
                        <figure className="image is-4by3">
                            <a>
                                <img
                                    src={photo}
                                    alt="Restaurant image"
                                    onClick={() =>
                                        this.props.clickCard(restaurant)
                                    }
                                />
                            </a>
                        </figure>
                    </div>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-content">
                                <a>
                                    <p
                                        className="title is-4"
                                        onClick={() =>
                                            this.props.clickCard(restaurant)
                                        }
                                    >
                                        {restaurant.name}
                                    </p>
                                </a>
                            </div>
                        </div>

                        <div className="content">
                            <b>Cuisine</b>
                            <br />
                            {restaurant.cuisines}
                            <br />
                            <b>Address</b>
                            <br />
                            {restaurant.location.address}
                            <br />
                            <b>Number</b>
                            <br />
                            {restaurant.phone_numbers}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        modal_state: "modal "
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.active !== this.props.active) {
            if (this.props.active === true) {
                console.log("Modal active");
                this.setState({ modal_state: "modal is-active" });
            } else {
                this.setState({ modal_state: "modal" });
            }
        }
    }

    render() {
        let restaurant = this.props.data;
        return (
            <div
                className={this.state.modal_state}
                style={{ overflow: "hidden" }}
            >
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{restaurant.name}</p>
                        <button
                            className="delete"
                            aria-label="close"
                            onClick={this.props.closeModal}
                        ></button>
                    </header>
                    <section className="modal-card-body">
                        <img src="https://via.placeholder.com/150"></img>
                        <h4 className="title is-4">Reviews</h4>
                    </section>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={this.props.closeModal}
                ></button>
            </div>
        );
    }
}

class App extends React.Component {
    state = {};
    render() {
        return (
            <div>
                <NavBar />
                <Search />
            </div>
        );
    }
}
export default App;
