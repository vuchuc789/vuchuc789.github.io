---
slug: kubernetes-funny-behavior
title: Kubernetes's funny behavior
authors: chuc
tags: [kubernetes]
---

> In this blog, I will discuss a scenario I encountered regularly when working with Kubernetes. It may require you to have some basic knowledge of Kubernetes.

<!-- truncate -->

To start with, we run a Nginx pod and set its request and limit to 1 core of CPU. Here is the pod's manifest:

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

Once the pod is ready, we can check the logs of this pod, and here is the result:

```
...
2024/10/13 09:01:48 [notice] 1#1: start worker process 88
2024/10/13 09:01:48 [notice] 1#1: start worker process 89
2024/10/13 09:01:48 [notice] 1#1: start worker process 90
2024/10/13 09:01:48 [notice] 1#1: start worker process 91
2024/10/13 09:01:48 [notice] 1#1: start worker process 92
2024/10/13 09:01:48 [notice] 1#1: start worker process 93
2024/10/13 09:01:48 [notice] 1#1: start worker process 94
2024/10/13 09:01:48 [notice] 1#1: start worker process 95
2024/10/13 09:01:48 [notice] 1#1: start worker process 96
2024/10/13 09:01:48 [notice] 1#1: start worker process 97
2024/10/13 09:01:48 [notice] 1#1: start worker process 98
2024/10/13 09:01:48 [notice] 1#1: start worker process 99
2024/10/13 09:01:48 [notice] 1#1: start worker process 100
2024/10/13 09:01:48 [notice] 1#1: start worker process 101
2024/10/13 09:01:48 [notice] 1#1: start worker process 102
2024/10/13 09:01:48 [notice] 1#1: start worker process 103
2024/10/13 09:01:48 [notice] 1#1: start worker process 104
2024/10/13 09:01:48 [notice] 1#1: start worker process 105
2024/10/13 09:01:48 [notice] 1#1: start worker process 106
2024/10/13 09:01:48 [notice] 1#1: start worker process 107
2024/10/13 09:01:48 [notice] 1#1: start worker process 108
```

As we can see, there are so many workers created. If you don't know, Nginx configures its default number of workers equal to the number of CPU cores. However, we have configured the pod's CPU limit to 1. Why are there so many Nginx workers created? Are the number of workers and the CPU limit related together?

The answer is that they are different terminologies. While the number of CPU cores is the number of the host machine, the CPU limit value is the amount of time that containers can use CPU in a period of time. To be specific, I ran the Nginx pod in a Kubernetes that has 80 CPU cores, which means there are 80 workers created as the default configuration of Nginx. Let's run the `lscpu` command in the pod's shell to see more about what happened to the CPU in a pod.

```
root@nginx:/# lscpu
Architecture:            x86_64
  CPU op-mode(s):        32-bit, 64-bit
  Address sizes:         46 bits physical, 48 bits virtual
  Byte Order:            Little Endian
CPU(s):                  80
  On-line CPU(s) list:   0-79
Vendor ID:               GenuineIntel
  Model name:            Intel(R) Xeon(R) Gold 6138 CPU @ 2.00GHz
    CPU family:          6
    Model:               85
    Thread(s) per core:  2
    Core(s) per socket:  20
    Socket(s):           2
    Stepping:            4
    BogoMIPS:            4000.00
    Flags:               fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs
                          bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt
                         tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l3 cdp_l3 invpcid_single pti intel_ppin ssbd mba ibrs ibpb stibp tpr_shadow vnmi flexpriorit
                         y ept vpid ept_ad fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm cqm mpx rdt_a avx512f avx512dq rdseed adx smap clflushopt clwb intel_pt avx512cd avx512bw avx512vl xsave
                         opt xsavec xgetbv1 xsaves cqm_llc cqm_occup_llc cqm_mbm_total cqm_mbm_local dtherm ida arat pln pts pku ospke md_clear flush_l1d arch_capabilities
Virtualization features:
  Virtualization:        VT-x
Caches (sum of all):
  L1d:                   1.3 MiB (40 instances)
  L1i:                   1.3 MiB (40 instances)
  L2:                    40 MiB (40 instances)
  L3:                    55 MiB (2 instances)
NUMA:
  NUMA node(s):          2
  NUMA node0 CPU(s):     0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78
  NUMA node1 CPU(s):     1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79
Vulnerabilities:
  Gather data sampling:  Mitigation; Microcode
  Itlb multihit:         KVM: Mitigation: VMX disabled
  L1tf:                  Mitigation; PTE Inversion; VMX conditional cache flushes, SMT vulnerable
  Mds:                   Mitigation; Clear CPU buffers; SMT vulnerable
  Meltdown:              Mitigation; PTI
  Mmio stale data:       Mitigation; Clear CPU buffers; SMT vulnerable
  Retbleed:              Mitigation; IBRS
  Spec rstack overflow:  Not affected
  Spec store bypass:     Mitigation; Speculative Store Bypass disabled via prctl and seccomp
  Spectre v1:            Mitigation; usercopy/swapgs barriers and __user pointer sanitization
  Spectre v2:            Mitigation; IBRS, IBPB conditional, STIBP conditional, RSB filling, PBRSB-eIBRS Not affected
  Srbds:                 Not affected
  Tsx async abort:       Mitigation; Clear CPU buffers; SMT vulnerable
```

You may see the above specification belongs to the host machine, and it shows that the CPU has 80 cores. Consequently, pods will use the CPU specification of the node for its runtime. This behavior will also happen to any arbitrary Docker containers, but you may see it less bizarre as containers running in Kubernetes.

Now we can dig deeper into what the CPU limit actually is. As I mentioned above, it is the amount of time that containers can use in a period. In Kubernetes, CPU usage is managed by time-slicing via the CFS (Completely Fair Scheduler) in the underlying Linux kernel. The CFS ensures that every container gets a fair share of the CPU within fixed time windows, or periods. For example, my node has 80 cores with the CFS period being 100ms, which means there are `80 cores * 100ms = 8000ms` of CPU available time per 100ms period for pods' usage (keep in mind that CPU can handle instructions simultaneously, so 8000ms per 100ms period is feasible). The Nginx pod is set CPU limit to `1 = 1 vCPU = 1 / 80 * 8000ms = 100ms`, so if the CPU usage in a period exceeds 100ms, the CFS will throttle the pod, meaning it won’t allow the container to use more CPU until the next period starts. 

In summary, the number of CPU cores and the CPU limit should be kindly distinguished. In addition to Nginx, you may encounter this phenomenon in some other applications, like the Jest testing library in Javascript and the testing package in Golang. If the number of spawned workers is not configured properly, pods will cause CPU throttling and will be terminated if health probes are configured.
