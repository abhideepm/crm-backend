const resetPasswordConfirmation = firstname =>
	`<div>
		<h3>Dear ${firstname},</h3>
		<p>Your password has been successful reset, you can now login with your new password.</p>
		<br>
		<div>
			Cheers!
		</div>
	</div>`

module.exports = resetPasswordConfirmation
