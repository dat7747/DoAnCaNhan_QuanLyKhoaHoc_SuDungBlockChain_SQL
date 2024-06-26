const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CourseRegistration", function () {
    let owner, student, token, vault, courseRegistration;

    beforeEach(async function () {
        [owner, student] = await ethers.getSigners();

        // Triển khai Token
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        // Triển khai Vault
        const Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.deploy(token.address);
        await vault.deployed();

        // Triển khai CourseRegistration
        const CourseRegistration = await ethers.getContractFactory("CourseRegistration");
        courseRegistration = await CourseRegistration.deploy(token.address, vault.address);
        await courseRegistration.deployed();

        // Chủ sở hữu thêm khóa học mới
        const courseId = 1;
        const price = ethers.utils.parseEther("1"); // 1 token
        const sessions = 10;
        await courseRegistration.connect(owner).addCourse(courseId, price, sessions);

        // Chuyển đủ số token vào tài khoản học viên
        const amountToTransfer = ethers.utils.parseEther("10"); // 10 tokens
        await token.transfer(student.address, amountToTransfer);

        // Học viên phê duyệt token cho CourseRegistration
        await token.connect(student).approve(courseRegistration.address, amountToTransfer);
    });

    it("should allow student to register for a course", async function () {
        const courseId = 1;

        // Kiểm tra số dư của học viên trước khi đăng ký
        const initialStudentBalance = await token.balanceOf(student.address);
        console.log("Initial student balance:", ethers.utils.formatEther(initialStudentBalance));

        // Học viên đăng ký khóa học
        await courseRegistration.connect(student).register(courseId);

        // Kiểm tra số dư của học viên sau khi đăng ký
        const finalStudentBalance = await token.balanceOf(student.address);
        console.log("Final student balance:", ethers.utils.formatEther(finalStudentBalance));

        // Kiểm tra số dư của vault
        const vaultBalance = await token.balanceOf(vault.address);
        console.log("Vault balance after registration:", ethers.utils.formatEther(vaultBalance));

        // Kiểm tra xem học viên đã được đăng ký chưa
        const isRegistered = await courseRegistration.registrationStatus(courseId, student.address);
        expect(isRegistered).to.be.true;

        // Kiểm tra sự kiện Registration
        await expect(courseRegistration.connect(student).register(courseId))
            .to.emit(courseRegistration, "Registration")
            .withArgs(student.address, courseId);

        // Kiểm tra số dư token của học viên sau khi đăng ký
        expect(finalStudentBalance).to.equal(initialStudentBalance.sub(ethers.utils.parseEther("1")));
    });
});
