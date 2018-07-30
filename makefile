localdir     = ./build/
remoteuser   = ryjiang
remotehost   = 192.168.88.89
remotedir    = /srv/http/hyper


rsync:
	rsync -avc --delete ${localdir} ${remoteuser}@${remotehost}:${remotedir}
