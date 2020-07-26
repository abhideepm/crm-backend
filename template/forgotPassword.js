const forgotPasswordEmail = (firstname, url) =>
	`<div>
		<h3>Dear ${firstname},</h3>
		<p>You requested for a password reset.</p>
		<p>Kindly use this <a href=${url}>link</a> to reset your password</p>
		<br>
		<p>Thank You</p>
	</div>`

module.exports = forgotPasswordEmail
