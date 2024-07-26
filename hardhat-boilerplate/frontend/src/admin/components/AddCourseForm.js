import React from "react";

export class AddCourseForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            price: "",
            sessions: "",
            status: "open",
            image: null,
            successMessage: ""
        };
    }

    handleIdChange = (event) => {
        this.setState({ id: event.target.value });
    };

    handlePriceChange = (event) => {
        this.setState({ price: event.target.value });
    };

    handleSessionsChange = (event) => {
        this.setState({ sessions: event.target.value });
    };

    handleStatusChange = (event) => {
        this.setState({ status: event.target.value });
    };

    handleImageChange = (event) => {
        this.setState({ image: event.target.files[0] });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { id, price, sessions, status, image } = this.state;
    
        if (!id || !price || !sessions || !image) {
            console.error("Invalid input data");
            return;
        }
    
        console.log("Submitting Course with values:");
        console.log("ID:", id);
        console.log("Price (ETH):", price);
        console.log("Sessions:", sessions);
        console.log("Status:", status);
        console.log("Image:", image);
    
        try {
            await this.props.onSubmit(id, price, sessions, status, image);
    
            this.setState({
                id: "",
                price: "",
                sessions: "",
                status: "open",
                image: null,
                successMessage: "Course added successfully!"
            });
        } catch (error) {
            console.error("Error adding course:", error);
            this.setState({ successMessage: "" });
        }
    };
    

    render() {
        return (
            <div className="container">
                <h2 className="my-4 text-center">Add Course</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">ID</label>
                        <input
                            type="number"
                            className="form-control"
                            id="id"
                            value={this.state.id}
                            onChange={this.handleIdChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (in ETH)</label>
                        <input
                            type="number"
                            step="0.0001"
                            className="form-control"
                            id="price"
                            value={this.state.price}
                            onChange={this.handlePriceChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sessions">Sessions</label>
                        <input
                            type="number"
                            className="form-control"
                            id="sessions"
                            value={this.state.sessions}
                            onChange={this.handleSessionsChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            className="form-control"
                            id="status"
                            value={this.state.status}
                            onChange={this.handleStatusChange}
                            required
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            onChange={this.handleImageChange}
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            Add Course
                        </button>
                    </div>
                </form>
                {this.state.successMessage && (
                    <div className="alert alert-success mt-3 text-center">{this.state.successMessage}</div>
                )}
            </div>
        );
    }
}
