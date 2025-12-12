# Grafana and Prometheus Setup Guide

## Installation
### Add Helm repo
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### Install kube-prometheus-stack
```bash
kubectl create namespace monitoring
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring
```

### Uninstall kube-prometheus-stack
```bash
helm uninstall kube-prometheus-stack -n monitoring
```

### Access Grafana
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
```
Then open http://localhost:3000 in your browser.

### Default Grafana credentials
- User: admin
- Password: (get with)
```bash
kubectl get secret --namespace monitoring kube-prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

### Access Prometheus
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
```

### Mark your pod for Prometheus scraping
Add these annotations to your pod or service:
```yaml
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/path: "/metrics"
    prometheus.io/port: "3000"
```
