import nmap

nma = nmap.PortScannerAsync()

print('Monitoring started')

def callback_result(host, scan_result):

    print('------------------')

    print(host, scan_result)

nma.scan(hosts='172.18.0.0/24', arguments='-A', callback=callback_result)
while nma.still_scanning():
    print('.', end=' ', flush=True)
    nma.wait(2)   # you can do whatever you want but I choose to wait after the end of the scan
