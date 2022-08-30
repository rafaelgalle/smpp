var smpp = require('smpp');
var session = smpp.connect({
	url: 'smpp://localhost:2775',
	debug: true
}, function() {

	session.bind_transceiver({
		system_id: 'FAKE_USER',
		password: 'FAKE_PASSWORD'
	}, function(pdu) {
		console.log('pdu: ', pdu)

		if (pdu.command_status === 0) {
			session.submit_sm({
				destination_addr: '+5542999999999',
				short_message: 'Hello!'
			}, function(pdu) {
        console.log('pdu: ', pdu)

				if (pdu.command_status === 0) {
          console.log('pdu: ', pdu.message_id)
					if (pdu.command_status === 0) console.log('command_status 0 =)')

					session.query_sm({
						message_id: pdu.message_id
					}, function(pdu) {
						console.log('pdu query sm: ', pdu)
					})
				}
			})

			session.on('deliver_sm', (pdu) => {
				console.log('receive deliver_sm: ', pdu)
				if(pdu.message_state === MessageStatuses.DELIVERED) console.log('message delivered')
			})
		}
	})
})