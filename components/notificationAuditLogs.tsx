import { useState } from 'react';
import { NotificationAuditLog } from '../types';
import { Mail, MessageSquare, AlertTriangle, CheckCircle, Search, Calendar, Database, Eye } from 'lucide-react';

interface NotificationAuditLogsProps {
  logs: NotificationAuditLog[];
}

export default function NotificationAuditLogs({ logs }: NotificationAuditLogsProps) {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = 
      log.recipient.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    const matchesChannel = channelFilter === 'All' || log.channel === channelFilter;
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div id="audit-logs-subpage" className="space-y-6 animate-fade-in-up">
      
      {/* Upper overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Platform Delivery & Notification Audit Logs</h3>
          <p className="text-xs text-slate-500">
            Immutable chronological logging of issued Telegram messenger triggers, OTP generation, and corporate email alert flows.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-slate-100 border border-slate-205 rounded-xl text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5 w-fit">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          TOTAL LOGGED: {logs.length} EVENTS
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-[16px] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* SEARCH INPUT */}
          <div className="relative w-full md:max-w-md">
            <input
              id="audit-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, recipient description or detail metadata..."
              className="w-full px-3.5 py-2 pl-10 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* CHANNEL FILTER TABS */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase flex items-center mr-1">
              Channel:
            </span>
            {['All', 'Telegram', 'Email'].map((ch) => (
              <button
                id={`filter-channel-${ch}`}
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  channelFilter === ch 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          {/* STATUS FILTER TABS */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase flex items-center mr-1">
              Status:
            </span>
            {['All', 'Sent', 'Failed'].map((st) => (
              <button
                id={`filter-status-${st}`}
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  statusFilter === st 
                    ? 'bg-slate-905 bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* IMMUTABLE LOG TABLE */}
      <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-800 text-sm">No recorded delivery logs matches your filters</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No telemetry alerts are found under the criteria. Expand your query parameters.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10.5px] uppercase font-mono tracking-wider">
                  <th className="py-4 px-6 font-semibold">Timestamp</th>
                  <th className="py-4 px-6 font-semibold">Delivery Endpoint Channel</th>
                  <th className="py-4 px-6 font-semibold">Recipient Target</th>
                  <th className="py-4 px-6 font-semibold">Trigger Event Description</th>
                  <th className="py-4 px-6 font-semibold">Metadata Logs Payload</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Time */}
                    <td className="py-4 px-6 font-mono text-[10.5px] text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                        {log.timestamp}
                      </div>
                    </td>

                    {/* Dynamic channel badge */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {log.channel === 'Telegram' ? (
                          <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-[10.5px] flex items-center gap-1 font-semibold uppercase font-mono">
                            <MessageSquare className="w-3 h-3 text-sky-500" />
                            Telegram Stream
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-250 rounded-lg text-[10.5px] flex items-center gap-1 font-semibold uppercase font-mono">
                            <Mail className="w-3 h-3 text-indigo-500" />
                            E-Mail Alert
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-4 px-6 font-mono text-slate-800 font-semibold truncate max-w-xs" title={log.recipient}>
                      {log.recipient}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 font-bold text-slate-900 leading-tight">
                      {log.action}
                    </td>

                    {/* Logs detail */}
                    <td className="py-4 px-6 text-[11px] text-slate-450 font-mono italic max-w-sm font-normal">
                      {log.details}
                    </td>

                    {/* Delivery Status indicator */}
                    <td className="py-4 px-6">
                      {log.status === 'Sent' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-extrabold uppercase font-mono">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          SUCCESS / DELIVERED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-150 text-rose-700 rounded-full text-[10px] font-extrabold uppercase font-mono">
                          <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                          FAILED / HALTED
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
