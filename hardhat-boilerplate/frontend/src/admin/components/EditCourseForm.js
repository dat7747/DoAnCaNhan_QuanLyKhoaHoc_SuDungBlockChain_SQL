import React from "react";

export class EditCourseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newCourseId: props.id,
      newPrice: props.price,
      newSession: props.sessions,
      newStatus: props.status,
      newImage: null,
    };
  }

  handleCourseIdChange = (event) => {
    this.setState({ newCourseId: event.target.value });
  };

  handlePriceChange = (event) => {
    this.setState({ newPrice: event.target.value });
  };

  handleSessionChange = (event) => {
    this.setState({ newSession: event.target.value });
  };

  handleStatusChange = (event) => {
    this.setState({ newStatus: event.target.value });
  };

  handleImageChange = (event) => {
    this.setState({ newImage: event.target.files[0] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { newCourseId, newPrice, newSession, newStatus, newImage } = this.state;

    // Kiểm tra và cập nhật giá trị mặc định nếu không có giá trị được chọn
    const statusToSend = newStatus === undefined || newStatus === null ? "open" : newStatus;
    const imageToSend = newImage === undefined || newImage === null ? null : newImage;

    this.props.onSubmit(newCourseId, newPrice, newSession, statusToSend, imageToSend);
  };

  render() {
    const { newStatus } = this.state;

    return (
      <div className="text-left">
        <h2 className="text-center">Edit Course</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseId">Course ID</label>
            <input
              type="number"
              className="form-control"
              id="courseId"
              defaultValue={this.state.newCourseId}
              onChange={this.handleCourseIdChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={this.state.newPrice}
              onChange={this.handlePriceChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="session">Session</label>
            <input
              type="number"
              className="form-control"
              id="session"
              value={this.state.newSession}
              onChange={this.handleSessionChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              className="form-control"
              id="status"
              defaultValue={newStatus || "open"}
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
            />
          </div>
          <button type="submit" className="btn btn-primary mx-auto d-block">
            Save Changes
          </button>
        </form>
      </div>
    );
  }
}
