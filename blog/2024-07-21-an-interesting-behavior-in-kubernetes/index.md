---
slug: an-interesting-behavior-in-kubernetes
title: An interesting behavior in Kubernetes
authors: chuc
tags: [fun-fact, kubernetes]
---

> In this blog, I will discuss a scenario I encountered regularly when working with Kubernetes. It may require you to have some basic knowledge of Kubernetes 😅.

<!-- truncate -->

## Set up

To start, we run a Nginx pod and set its request and limit to 1 core of CPU. Here is the pod's manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - image: nginx:1.27
      name: nginx
      resources:
        requests:
          cpu: 1
        limits:
          cpu: 1
```

(to be continued...)
