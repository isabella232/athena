k8s_yaml([
    './deploy/k8s/athena-manager.yaml',
    './deploy/k8s/mongodb.yaml',
])

k8s_resource('athena-manager', port_forwards=5000)
k8s_resource('mongodb-standalone', port_forwards=27017)