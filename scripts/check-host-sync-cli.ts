import { reportHostModuleDrift } from './check-host-sync';

process.exitCode = reportHostModuleDrift();
