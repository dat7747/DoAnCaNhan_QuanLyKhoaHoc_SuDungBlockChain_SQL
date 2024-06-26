// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Vault.sol";

contract CourseRegistration is Ownable {
    using SafeMath for uint256;

    IERC20 public token;
    Vault public vault;

    struct Course {
        uint256 price;
        uint256 sessions;
        address[] registeredUsers;
    }

    mapping(uint256 => mapping(address => bool)) public registrationStatus;
    mapping(uint256 => Course) public courses;
    uint256[] public courseIds;
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public attendance;

    event Registration(address indexed user, uint256 indexed courseId);
    event CourseNotification(uint256 indexed courseId, string notification, string zoomLink, uint256 indexed sessionNumber);

    constructor(IERC20 _token, Vault _vault) {
        token = _token;
        vault = _vault;
    }

    function addCourse(uint256 _courseId, uint256 _price, uint256 _sessions) public onlyOwner {
        require(_price > 0, "Price must be greater than zero");
        require(_sessions > 0, "Number of sessions must be greater than zero");

        courses[_courseId] = Course(_price, _sessions, new address[](0));
        courseIds.push(_courseId);
    }

    function register(uint256 _courseId) external {
        require(courses[_courseId].price > 0, "Course ID does not exist");

        uint256 price = courses[_courseId].price;
        token.transferFrom(msg.sender, address(vault), price);

        courses[_courseId].registeredUsers.push(msg.sender);
        registrationStatus[_courseId][msg.sender] = true;

        emit Registration(msg.sender, _courseId);
    }

    function markAttendance(uint256 _courseId, uint256 _session) public onlyOwner {
        require(_session > 0 && _session <= courses[_courseId].sessions, "Invalid session number");
        attendance[_courseId][msg.sender][_session] = true;
    }

    function getCourseCount() public view returns (uint256) {
        return courseIds.length;
    }

    function getCourseId(uint256 index) public view returns (uint256) {
        require(index < courseIds.length, "Index out of bounds");
        return courseIds[index];
    }

    function getCourse(uint256 _courseId) public view returns (uint256 price, uint256 sessions, uint256 userCount) {
        require(courses[_courseId].price > 0, "Course ID does not exist");
        return (courses[_courseId].price, courses[_courseId].sessions, courses[_courseId].registeredUsers.length);
    }

    function getRegisteredUserCount(uint256 _courseId) public view returns (uint256) {
        require(courses[_courseId].price > 0, "Course ID does not exist");
        return courses[_courseId].registeredUsers.length;
    }

    function getRegisteredUser(uint256 _courseId, uint256 index) public view returns (address) {
        require(courses[_courseId].price > 0, "Course ID does not exist");
        require(index < courses[_courseId].registeredUsers.length, "Index out of bounds");
        return courses[_courseId].registeredUsers[index];
    }

    function removeCourse(uint256 _courseId) public onlyOwner {
        require(courses[_courseId].price > 0, "Course ID does not exist");

        delete courses[_courseId];
        for (uint256 i = 0; i < courseIds.length; i++) {
            if (courseIds[i] == _courseId) {
                courseIds[i] = courseIds[courseIds.length - 1];
                courseIds.pop();
                break;
            }
        }
    }

    function editCourse(uint256 _courseId, uint256 _price, uint256 _sessions) public onlyOwner {
        require(courses[_courseId].price > 0, "Course ID does not exist");
        require(_price > 0, "Price must be greater than zero");
        require(_sessions > 0, "Number of sessions must be greater than zero");

        courses[_courseId].price = _price;
        courses[_courseId].sessions = _sessions;
    }

    function sendNotification(uint256 _courseId, string memory _notification, string memory _zoomLink, uint256 _sessionNumber) public onlyOwner {
        require(courses[_courseId].price > 0, "Course ID does not exist");

        for (uint256 i = 0; i < courses[_courseId].registeredUsers.length; i++) {
            address user = courses[_courseId].registeredUsers[i];

            if (registrationStatus[_courseId][user]) {
                emit CourseNotification(_courseId, _notification, _zoomLink, _sessionNumber);
            }
        }
    }

    function getListCourses() public view returns (uint256[] memory, uint256[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](courseIds.length);
        uint256[] memory prices = new uint256[](courseIds.length);
        uint256[] memory sessions = new uint256[](courseIds.length);

        for (uint256 i = 0; i < courseIds.length; i++) {
            ids[i] = courseIds[i];
            prices[i] = courses[courseIds[i]].price;
            sessions[i] = courses[courseIds[i]].sessions;
        }

        return (ids, prices, sessions);
    }

    function getAttendanceStatus(uint256 _courseId) public view returns (address[] memory, bool[][] memory) {
        require(courses[_courseId].price > 0, "Course ID does not exist");

        uint256 userCount = courses[_courseId].registeredUsers.length;
        uint256 sessionCount = courses[_courseId].sessions;

        bool[][] memory attendanceStatusArray = new bool[][](userCount);
        address[] memory users = new address[](userCount);

        for (uint256 i = 0; i < userCount; i++) {
            address user = courses[_courseId].registeredUsers[i];
            users[i] = user;

            bool[] memory userAttendance = new bool[](sessionCount);
            for (uint256 j = 0; j < sessionCount; j++) {
                userAttendance[j] = attendance[_courseId][user][j + 1];
            }
            attendanceStatusArray[i] = userAttendance;
        }

        return (users, attendanceStatusArray);
    }

    function markAttendanceByLink(uint256 _courseId, uint256 _session) public {
        require(_session > 0 && _session <= courses[_courseId].sessions, "Invalid session number");
        attendance[_courseId][msg.sender][_session] = true;
    }

    function getSessionAttendance(uint256 _courseId, uint256 _session) public view returns (address[] memory, bool[] memory) {
        require(_session > 0 && _session <= courses[_courseId].sessions, "Invalid session number");

        uint256 userCount = courses[_courseId].registeredUsers.length;
        address[] memory users = new address[](userCount);
        bool[] memory userAttendance = new bool[](userCount);

        for (uint256 i = 0; i < userCount; i++) {
            address user = courses[_courseId].registeredUsers[i];
            users[i] = user;
            userAttendance[i] = attendance[_courseId][user][_session];
        }

        return (users, userAttendance);
    }
}
