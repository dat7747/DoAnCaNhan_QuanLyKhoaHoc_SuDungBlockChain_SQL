import React from "react";

export class CourseList extends React.Component {
  handleButtonClick(course) {
    alert(`Course ID: ${course.id}, Price: ${course.price}, Sessions: ${course.sessions}, Status: ${course.status}`);
  }

  render() {
    const { courses } = this.props;

    return (
      <div>
        <h2>Course List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Price</th>
              <th>Sessions</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.price}</td>
                <td>{course.sessions}</td>
                <td>{course.status}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => this.handleButtonClick(course)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
