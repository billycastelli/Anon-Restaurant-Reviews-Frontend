import React from "react";
import logo from "./logo.svg";
import "./App.css";

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <nav
                className="navbar is-danger"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <a className="navbar-item" href="">
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
                                <SearchInput
                                    handleChange={this.props.handleChange}
                                    handleSubmit={this.props.handleSubmit}
                                    input={this.props.input}
                                    name={this.props.name}
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

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.props.handleSubmit}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search for restaurants"
                        value={this.props.input}
                        onChange={this.props.handleChange}
                        name={this.props.name}
                    />
                </form>
            </React.Fragment>
        );
    }
}

class HeaderText extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="title is-1" style={{ textAlign: "center" }}>
                    Honest Opinions
                </h1>
                <p className="subtitle" style={{ textAlign: "center" }}>
                    A truly anonymous way to review local restaurants
                </p>
            </React.Fragment>
        );
    }
}

class Search extends React.Component {
    constructor() {
        super();
    }

    state = {
        userInput: null,
        lat: null,
        long: null,
    };

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
                                        <SearchInput
                                            handleChange={
                                                this.props.handleChange
                                            }
                                            handleSubmit={
                                                this.props.handleSubmit
                                            }
                                            input={this.props.input}
                                            name={this.props.name}
                                        />
                                    </div>
                                    <div className="control">
                                        <a
                                            className="button is-info"
                                            onClick={this.props.handleSubmit}
                                        >
                                            Search
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="container"
                                    style={{ textAlign: "center" }}
                                ></div>
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
        modalData: {},
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
            mode: "cors",
        })
            .then((Response) => {
                return Response.json();
            })
            .then((jsonData) => {
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
        this.setState({ modalData: data });
        this.setState({ displayModal: true });
        document.getElementById("html").classList.add("is-clipped");
        // Figure out how to stop the body scrolling in the background
        // document.body.classList.add()
        console.log(this.state.displayModal);
    }

    closeModal() {
        console.log("Close clicked...");
        this.setState({ displayModal: false });
        document.getElementById("html").classList.remove("is-clipped");
    }

    render() {
        let results = <React.Fragment />;
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
        this.getReviewsServer = this.getReviewsServer.bind(this);
        this.submitReview = this.submitReview.bind(this);
    }

    state = {
        modal_state: "modal ",
        modal_data: null,
    };

    getReviewsServer(rid) {
        console.log("Requesting reviews...", rid);
        let BASE_URL =
            "https://4jb0iea9tb.execute-api.us-west-2.amazonaws.com/prod/review?";
        let FULL_URL = BASE_URL + "restaurant_id=" + rid;
        fetch(FULL_URL, {
            method: "GET",
            mode: "cors",
        })
            .then((Response) => {
                return Response.json();
            })
            .then((jsonData) => {
                console.log(jsonData);
                this.setState({ modal_data: jsonData });
            });
    }

    submitReview(rid) {
        let restaurant_id = rid;
        let review_text = document.getElementById("input_area").value;
        let REQUEST_URL =
            "https://4jb0iea9tb.execute-api.us-west-2.amazonaws.com/prod/review";
        fetch(REQUEST_URL, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                restaurant_id: restaurant_id,
                review_text: review_text,
            }),
        }).then((Response) => {
            console.log(Response.json());
            this.getReviewsServer(rid);
        });
        document.getElementById("input_area").value = "";
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.active !== this.props.active) {
            if (this.props.active === true) {
                console.log("Modal active");
                this.getReviewsServer(this.props.data.id);
                this.setState({ modal_state: "modal is-active" });
            } else {
                this.setState({ modal_state: "modal" });
            }
        }
    }

    render() {
        let restaurant = this.props.data;
        let photo = "https://bulma.io/images/placeholders/1280x960.png";
        let address = "";

        if (restaurant.photos) {
            photo = restaurant.photos[0].photo.url;
        }
        if (restaurant.location) {
            address = restaurant.location.address;
        }

        let reviews = null;
        console.log("DATA: ", this.state.modal_data);
        if (this.state.modal_data == null) {
            reviews = <p style={{ marginBottom: "2em" }}>No reviews found!</p>;
        } else if (this.state.modal_data.length === 0) {
            reviews = <p style={{ marginBottom: "2em" }}>No reviews found!</p>;
        } else {
            reviews = [];
            for (var i = 0; i < this.state.modal_data.length; i++) {
                reviews.push(
                    <Review
                        text={this.state.modal_data[i].review_text}
                        timestamp={this.state.modal_data[i].review_id}
                        key={i}
                    />
                );
            }
        }
        return (
            <div className={this.state.modal_state}>
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
                        <div className="columns">
                            <div className="column is-one-third">
                                <figure className="image is-4by3">
                                    <img src={photo} />
                                </figure>
                            </div>
                            <div className="column is-two-thirds">
                                <p>
                                    <b>Cuisines: </b>
                                    {restaurant.cuisines}
                                </p>
                                <p>
                                    <b>Location: </b>
                                    {address}
                                </p>
                                <p>
                                    <b>Phone numbers: </b>
                                    {restaurant.phone_numbers}
                                </p>
                            </div>
                        </div>
                        <h4 className="title is-4">Reviews</h4>
                        {reviews}
                        <InputReview
                            rid={restaurant.id}
                            onSubmit={this.submitReview}
                        />
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

class Review extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="columns is-mobile">
                <figure className="column is-2-mobile is-1-desktop is-1-tablet image is-32x32">
                    <img
                        src="NobodysOpinion_icon_grey.png"
                        style={{ width: "32", height: "32" }}
                    />
                </figure>

                <div className="column is-10-mobile is-11-desktop is-11-tablet">
                    <p>
                        <b>Anonymous: </b>
                        {this.props.text}
                    </p>
                    <p className="is-size-7 has-text-grey">
                        {new Date(parseFloat(this.props.timestamp) * 1000)
                            .toISOString()
                            .slice(0, 10)}
                    </p>
                </div>
            </div>
        );
    }
}

class InputReview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="field">
                <label className="label">Write a review</label>
                <div className="control">
                    <textarea
                        className="textarea"
                        placeholder="Enter your review here"
                        id="input_area"
                    ></textarea>
                </div>
                <button
                    className="button is-link"
                    style={{ marginTop: "1em" }}
                    onClick={() => this.props.onSubmit(this.props.rid)}
                >
                    Submit
                </button>
            </div>
        );
    }
}

class LocalResultsButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="has-text-centered" style={{ marginTop: "-3em" }}>
                <button
                    className="button"
                    onClick={this.props.handleLocalClick}
                >
                    Show local restaurants
                </button>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navInput: "",
            mainInput: "",
            lat: null,
            lon: null,
            query: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleNavSubmit = this.handleNavSubmit.bind(this);
        this.handleMainSubmit = this.handleMainSubmit.bind(this);
        this.handleLocalClick = this.handleLocalClick.bind(this);
        this.saveCoords = this.saveCoords.bind(this);
    }

    handleChange(event) {
        console.log("New input value: " + event.target.value);
        console.log("event.target.name: " + [event.target.name]);
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleNavSubmit(event) {
        console.log("In submit: " + event.target);
        event.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.saveCoords);
        }
        this.setState({ query: this.state.navInput });
    }

    handleMainSubmit(event) {
        console.log("In submit: " + event.target);
        event.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.saveCoords);
        }
        this.setState({ query: this.state.mainInput });
    }

    handleLocalClick() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.saveCoords);
        }
        this.setState({ query: "lunch" });
    }

    saveCoords(position) {
        this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        });
    }

    render() {
        let results = <React.Fragment />;
        if (this.state.query && this.state.lat && this.state.lon) {
            results = (
                <SearchResults
                    query={this.state.query}
                    lat={this.state.lat}
                    lon={this.state.lon}
                />
            );
        }

        return (
            <div>
                <NavBar
                    handleChange={this.handleChange}
                    handleSubmit={this.handleNavSubmit}
                    input={this.state.input}
                    name="navInput"
                />
                <Search
                    handleChange={this.handleChange}
                    handleSubmit={this.handleMainSubmit}
                    input={this.state.input}
                    name="mainInput"
                />
                <LocalResultsButton handleLocalClick={this.handleLocalClick} />
                {results}
            </div>
        );
    }
}
export default App;
