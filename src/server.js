var smpp = require('smpp')
var server = smpp.createServer({
	debug: true
}, function(session) {
	session.on('error', function (err) {
		console.error(err)
  })

	session.on('bind_transceiver', function(pdu) {
		session.pause()
    var checkAsyncUserPass = function (user, pwd, onComplete) {
      setTimeout(function () {
        if (user === "FAKE_USER" && pwd === "FAKE_PASSWORD") {
          onComplete()
        } else {
          onComplete("invalid user and password combination")
        }
      }, 25)
    }
		checkAsyncUserPass(pdu.system_id, pdu.password, function(err) {
			if (err) {
				session.send(pdu.response({
					command_status: smpp.ESME_RBINDFAIL
				}))
				return session.close()				
			}
			session.send(pdu.response())
			session.resume()
		})
	})

  session.on('submit_sm', function(pdu) {
		const messageid= fakeId()
    session.send(pdu.response({
      message_id: messageid
    }))

		setTimeout(function(){
			console.log('send deliver_sm')
			const pdu = new smpp.PDU('deliver_sm',{
				message_id: messageid
			})
			session.send(pdu.response({}))
		}, 5000)
  })

	session.on('query_sm', function(pdu) {
		session.send(pdu.response({
			message_id: pdu.message_id
		}))
  })

	setTimeout(function(){
		console.log('send fake deliver_sm')
		const pdu = new smpp.PDU('deliver_sm',{
			message_id: fakeId()
		})
		session.send(pdu.response({}))
	}, 10000)
})

server.listen(2775)

function fakeId(){
	return 'f' + Math.floor((Math.random() * 100) + 1) + 'a' + Math.floor((Math.random() * 100) + 1) + 'b' + Math.floor((Math.random() * 100) + 1)
}