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

			setTimeout(function(){
				console.log('call deliver_sm')
				session.deliver_sm({
				}, function(pdu) {
					console.log('pdu deliver_sm: ', pdu)
				})
			}, 10000)
		}
	})
})