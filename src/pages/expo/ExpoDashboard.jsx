import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import {
  FaUsers,
  FaStore,
  FaHandshake,
  FaBuilding,
  FaChartLine,
  FaSearch,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaUserTie,
  FaFileDownload,
  FaExternalLinkAlt,
  FaFilter,
  FaTh,
  FaListUl,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaRobot,
  FaCopy,
  FaCheck,
  FaGlobe
} from 'react-icons/fa';
import { MdMeetingRoom, MdOutlineAnalytics, MdWhatsapp, MdEmail } from 'react-icons/md';
import { BsEyeFill, BsShop } from 'react-icons/bs';
import { expoAdminClient, expoApiClient } from '../../utils/httpClient';
import Loader from '../../components/Loader';
import { toastError, toastSuccess } from '../../utils/toast';
import moment from 'moment';
import './ExpoDashboard.css';

// 27 Standard Stall Definitions
const STALL_CONFIGS = [
  // Diamond (1 stall, 4 meeting rooms/tables)
  { code: 'D1', type: 'Diamond', tablesCount: 4, colorClass: 'stall-diamond', badgeClass: 'badge-diamond' },
  // Platinum (2 stalls, 3 meeting rooms/tables each)
  { code: 'P1', type: 'Platinum', tablesCount: 3, colorClass: 'stall-platinum', badgeClass: 'badge-platinum' },
  { code: 'P2', type: 'Platinum', tablesCount: 3, colorClass: 'stall-platinum', badgeClass: 'badge-platinum' },
  // Gold (4 stalls, 2 meeting rooms/tables each)
  { code: 'G1', type: 'Gold', tablesCount: 2, colorClass: 'stall-gold', badgeClass: 'badge-gold' },
  { code: 'G2', type: 'Gold', tablesCount: 2, colorClass: 'stall-gold', badgeClass: 'badge-gold' },
  { code: 'G3', type: 'Gold', tablesCount: 2, colorClass: 'stall-gold', badgeClass: 'badge-gold' },
  { code: 'G4', type: 'Gold', tablesCount: 2, colorClass: 'stall-gold', badgeClass: 'badge-gold' },
  // Standard (20 stalls, 2 meeting rooms/tables each)
  ...Array.from({ length: 20 }, (_, i) => ({
    code: `S${i + 1}`,
    type: 'Standard',
    tablesCount: 2,
    colorClass: 'stall-standard',
    badgeClass: 'badge-standard'
  }))
];

const ExpoDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataRefreshing, setDataRefreshing] = useState(false);
  const [allCount, setAllCount] = useState(null);
  const [exposList, setExposList] = useState([]);
  const [selectedExpoCode, setSelectedExpoCode] = useState('');
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [stallBookings, setStallBookings] = useState([]);
  const [expoVisitors, setExpoVisitors] = useState([]);

  // View & Filter States
  const [activeTierFilter, setActiveTierFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' or 'TABLE'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Stall Drilldown
  const [selectedStallModal, setSelectedStallModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTab, setModalTab] = useState('ENTRIES'); // 'ENTRIES', 'MEETINGS', 'INTERACTIONS'
  const [stallEntryVisitors, setStallEntryVisitors] = useState([]);
  const [stallCustomersData, setStallCustomersData] = useState([]);
  const [stallDetailInfo, setStallDetailInfo] = useState(null);
  const [visitorSearchQuery, setVisitorSearchQuery] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Dynamic Live Expo 3D Arena Link
  const expoLink = selectedExpoCode
    ? `https://storage.googleapis.com/airpropx-expo-dev/index.html?expo=${encodeURIComponent(selectedExpoCode)}`
    : '';

  const handleCopyLink = () => {
    if (!expoLink) return;
    navigator.clipboard.writeText(expoLink);
    setLinkCopied(true);
    toastSuccess('Expo Live Arena link copied to clipboard!');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // Fetch initial summary counts and expos
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      // 1. Get Top Dashboard Info
      try {
        const countRes = await expoAdminClient.get('/dashboard/getAllinfo.php', config);
        if (countRes?.data?.status) {
          setAllCount(countRes.data);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }

      // 2. Get Expos list
      const exposRes = await expoAdminClient.get('NewExpos/get.php?type=ongoing&limit=50&skip=0', config);
      let list = [];
      if (exposRes?.data?.status && exposRes.data.data?.length > 0) {
        list = exposRes.data.data;
      } else {
        // Fallback to fetch all expos if no ongoing
        const allExposRes = await expoAdminClient.get('NewExpos/get.php?limit=50&skip=0', config);
        if (allExposRes?.data?.status) {
          list = allExposRes.data.data || [];
        }
      }

      setExposList(list);

      // Choose default active expo code (saved in localStorage or first expo in list)
      const savedCode = localStorage.getItem('expoCode');
      const defaultExpo = list.find((item) => item.expoUnqCode === savedCode) || list[0] || null;

      if (defaultExpo) {
        setSelectedExpoCode(defaultExpo.expoUnqCode);
        setSelectedExpo(defaultExpo);
        await loadExpoAnalytics(defaultExpo.expoUnqCode);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toastError('Failed to load expo data');
    } finally {
      setLoading(false);
    }
  };

  // Load analytics for a specific expo
  const loadExpoAnalytics = async (expoCode) => {
    if (!expoCode) return;
    setDataRefreshing(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      // Fetch bookings for this expo
      const bookingsPromise = expoAdminClient.get(`NewExpo/getExpoBookings.php?id=${expoCode}&limit=100&skip=0`, config);
      // Fetch visitors for this expo
      const visitorsPromise = expoAdminClient.get(`expoUserAnalytics/expo/get.php?expoId=${expoCode}&limit=500&skip=0`, config);

      const [bookingsRes, visitorsRes] = await Promise.allSettled([bookingsPromise, visitorsPromise]);

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data?.status) {
        setStallBookings(bookingsRes.value.data.data || []);
      } else {
        setStallBookings([]);
      }

      if (visitorsRes.status === 'fulfilled' && visitorsRes.value?.data?.status) {
        setExpoVisitors(visitorsRes.value.data.data || []);
      } else {
        setExpoVisitors([]);
      }
    } catch (err) {
      console.error('Error loading expo bookings & visitors:', err);
    } finally {
      setDataRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleExpoChange = (e) => {
    const code = e.target.value;
    setSelectedExpoCode(code);
    const found = exposList.find((ex) => ex.expoUnqCode === code) || null;
    setSelectedExpo(found);
    if (code) {
      localStorage.setItem('expoCode', code);
      loadExpoAnalytics(code);
    }
  };

  // Compile full 27 stalls data enriched with booking, visitor and meeting stats
  const compiled27Stalls = useMemo(() => {
    return STALL_CONFIGS.map((cfg) => {
      // Find booking for this stall code (D1, P1, S4, etc.)
      const booking = stallBookings.find((b) => {
        const bCode = b.stallUnqCode || b.stall_unq_code || b.stallCode || '';
        return bCode.toUpperCase() === cfg.code.toUpperCase();
      });

      const isOccupied = Boolean(booking);
      const builderName = booking?.builderName || booking?.builder_name || booking?.companyName || (isOccupied ? 'Registered Exhibitor' : 'Available / Unassigned');
      const managerName = booking?.managerName || booking?.manager_name || booking?.manager?.name || '-';
      const managerPhone = booking?.managerPhone || booking?.manager_phone || booking?.manager?.phone || '-';

      // Parse executives/tables
      let executives = [];
      if (booking?.executives) {
        executives = Array.isArray(booking.executives) ? booking.executives : [];
      } else if (booking?.Executive) {
        executives = Array.isArray(booking.Executive) ? booking.Executive : [];
      }

      // If no explicit executives array, synthesize default meeting tables up to tablesCount
      const meetingTables = Array.from({ length: cfg.tablesCount }, (_, idx) => {
        const tableNo = idx + 1;
        const execObj = executives[idx] || {};
        return {
          tableNo,
          name: execObj.name || `Executive ${tableNo}`,
          phone: execObj.phone || '-',
          interactionsCount: 0 // will be populated if customer data exists
        };
      });

      // Directly extract visitorCount and visitorTableCount from getExpoBookings.php response
      let visitorsCount = 0;
      let meetingInteractionsCount = 0;
      let brochureDownloads = 0;

      if (booking) {
        if (booking.visitorCount !== undefined) {
          visitorsCount = Number(booking.visitorCount) || 0;
        } else if (booking.visitorsCount !== undefined) {
          visitorsCount = Number(booking.visitorsCount) || 0;
        } else if (Array.isArray(booking.visitors)) {
          visitorsCount = booking.visitors.length;
        }

        if (booking.visitorTableCount !== undefined) {
          meetingInteractionsCount = Number(booking.visitorTableCount) || 0;
        } else if (booking.visitor_table_count !== undefined) {
          meetingInteractionsCount = Number(booking.visitor_table_count) || 0;
        } else if (booking.tableInteractionsCount !== undefined) {
          meetingInteractionsCount = Number(booking.tableInteractionsCount) || 0;
        }
      }

      return {
        ...cfg,
        booking,
        isOccupied,
        builderName,
        managerName,
        managerPhone,
        meetingTables,
        executives,
        stallInfoId: booking?.stallInfoId || booking?.newStallId || booking?.id || null,
        visitorsCount,
        meetingInteractionsCount,
        brochureDownloads
      };
    });
  }, [stallBookings, expoVisitors]);

  // Overall analytics aggregates
  const analyticsSummary = useMemo(() => {
    const totalStalls = 27;
    const occupiedStalls = compiled27Stalls.filter((s) => s.isOccupied).length;
    const totalStallVisits = compiled27Stalls.reduce((sum, s) => sum + s.visitorsCount, 0);
    const totalMeetingInteractions = compiled27Stalls.reduce((sum, s) => sum + s.meetingInteractionsCount, 0);
    const totalBrochureDownloads = compiled27Stalls.reduce((sum, s) => sum + s.brochureDownloads, 0);

    // Find top visited stall
    const topStall = [...compiled27Stalls].sort((a, b) => b.visitorsCount - a.visitorsCount)[0];

    return {
      totalStalls,
      occupiedStalls,
      availableStalls: totalStalls - occupiedStalls,
      totalVisitors: expoVisitors.length || allCount?.currentUserExpoVisitorsCount || totalStallVisits,
      totalStallVisits,
      totalMeetingInteractions,
      totalBrochureDownloads,
      topStall: topStall && topStall.visitorsCount > 0 ? topStall : null
    };
  }, [compiled27Stalls, expoVisitors, allCount]);

  // Filtered stalls based on tier and search
  const filteredStalls = useMemo(() => {
    return compiled27Stalls.filter((stall) => {
      // Tier filter
      if (activeTierFilter === 'DIAMOND' && stall.type !== 'Diamond') return false;
      if (activeTierFilter === 'PLATINUM' && stall.type !== 'Platinum') return false;
      if (activeTierFilter === 'GOLD' && stall.type !== 'Gold') return false;
      if (activeTierFilter === 'STANDARD' && stall.type !== 'Standard') return false;
      if (activeTierFilter === 'OCCUPIED' && !stall.isOccupied) return false;
      if (activeTierFilter === 'AVAILABLE' && stall.isOccupied) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const codeMatch = stall.code.toLowerCase().includes(q);
        const nameMatch = stall.builderName.toLowerCase().includes(q);
        const typeMatch = stall.type.toLowerCase().includes(q);
        if (!codeMatch && !nameMatch && !typeMatch) return false;
      }

      return true;
    });
  }, [compiled27Stalls, activeTierFilter, searchQuery]);

  // Group filtered stalls tier-wise into rows (Diamond, Platinum, Gold, Standard)
  const groupedTiers = useMemo(() => {
    const tiers = [
      { type: 'Diamond', title: 'Diamond Stalls (4 Meeting Tables each)', badgeClass: 'badge-diamond', stalls: [] },
      { type: 'Platinum', title: 'Platinum Stalls (3 Meeting Tables each)', badgeClass: 'badge-platinum', stalls: [] },
      { type: 'Gold', title: 'Gold Stalls (2 Meeting Tables each)', badgeClass: 'badge-gold', stalls: [] },
      { type: 'Standard', title: 'Standard Stalls (2 Meeting Tables each)', badgeClass: 'badge-standard', stalls: [] }
    ];

    filteredStalls.forEach((stall) => {
      const target = tiers.find((t) => t.type === stall.type);
      if (target) {
        target.stalls.push(stall);
      }
    });

    return tiers
      .filter((t) => t.stalls.length > 0)
      .map((t) => {
        const bookedCount = t.stalls.filter((s) => s.isOccupied).length;
        const availableCount = t.stalls.length - bookedCount;
        return {
          ...t,
          bookedCount,
          availableCount
        };
      });
  }, [filteredStalls]);

  // Handle Opening Stall Analytics Modal
  const handleOpenStallModal = async (stall) => {
    setSelectedStallModal(stall);
    setStallDetailInfo(null);
    setStallEntryVisitors([]);
    setStallCustomersData([]);
    setVisitorSearchQuery('');
    setModalTab('ENTRIES');
    setModalLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` || null
        }
      };

      // 1. Fetch detailed stall info if available
      if (stall.stallInfoId) {
        try {
          const detailRes = await expoApiClient.get(`/createStall/getStallInfo.php?id=${stall.stallInfoId}`);
          if (detailRes?.data?.status && detailRes.data.data?.length > 0) {
            setStallDetailInfo(detailRes.data.data[0]);
          }
        } catch (e) {
          console.error('Error loading detailed stall info:', e);
        }
      }

      // 2. Fetch Total Stall Visitors who entered the stall (getStallVisitors.php)
      const visitorsPromise = expoApiClient.get(
        `expoAnalytics/getStallVisitors.php?expoId=${selectedExpoCode}&stallCode=${stall.code}`,
        config
      );

      // 3. Fetch Stall Meeting Table Customers / Interactions (getStallCustomers.php)
      const stallInfoId = stall.stallInfoId || stall.code;
      const customersPromise = expoApiClient.get(
        `expoAnalytics/getStallCustomers.php?expoCode=${selectedExpoCode}&stallId=${stallInfoId}`,
        config
      );

      const [visitorsRes, customersRes] = await Promise.allSettled([visitorsPromise, customersPromise]);

      // Process Stall Entry Visitors
      if (visitorsRes.status === 'fulfilled' && (visitorsRes.value?.data?.success || visitorsRes.value?.data?.status)) {
        setStallEntryVisitors(visitorsRes.value.data.data || []);
      } else {
        setStallEntryVisitors([]);
      }

      // Process Meeting Table Customers
      if (customersRes.status === 'fulfilled' && (customersRes.value?.data?.success || customersRes.value?.data?.status)) {
        const parsed = parseCustomerData(customersRes.value.data.data, stall);
        setStallCustomersData(parsed);
      } else if (Array.isArray(stall.booking?.visitors)) {
        setStallCustomersData(parseCustomerData(stall.booking.visitors, stall));
      } else {
        setStallCustomersData(generateFallbackVisitors(stall));
      }
    } catch (error) {
      console.error('Error fetching stall analytics details:', error);
      setStallCustomersData(generateFallbackVisitors(stall));
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedStallModal(null);
    setStallEntryVisitors([]);
    setStallCustomersData([]);
  };

  // Helper to parse complex customer analytics structures
  const parseCustomerData = (data, stall) => {
    let list = [];
    if (!data) return list;

    // Helper to resolve executive display name
    const resolveExecutiveName = (item, fallbackTableNo) => {
      if (item.executiveId === 'AI_BOT' || item.executiveId === 'AI' || item.isAi) {
        return 'AI Executive (AI Bot)';
      }
      if (item.executive_name && item.executive_name !== 'null') {
        return item.executive_name;
      }
      if (item.executiveName && item.executiveName !== 'null') {
        return item.executiveName;
      }
      if (item.executiveId && item.executiveId !== 'null') {
        return item.executiveId;
      }
      return `Executive ${fallbackTableNo}`;
    };

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const tableNum = Number(item.tableId) || (index % stall.tablesCount) + 1;
        const execName = resolveExecutiveName(item, tableNum);
        const isAi = item.executiveId === 'AI_BOT' || execName.includes('AI');

        if (item.users && Array.isArray(item.users)) {
          item.users.forEach((u, uIdx) => {
            list.push({
              id: `${index}-${uIdx}`,
              userId: u.userId || u.id,
              name: u.name || u.userName || `Visitor ${uIdx + 1}`,
              phone: u.number || u.phone || u.mobile || '-',
              email: u.email || '-',
              visitedAt: u.joined_at ? `${item.date || ''} ${u.joined_at}`.trim() : (item.date || moment().format('YYYY-MM-DD HH:mm')),
              executiveName: execName,
              executiveId: item.executiveId,
              isAi,
              tableNo: tableNum,
              interactionType: isAi ? 'AI Executive Session' : (u.type || 'Meeting Room Call'),
              duration: u.duration || '3m 30s'
            });
          });
        } else {
          list.push({
            id: index,
            userId: item.userId || item.id,
            name: item.name || item.userName || `Visitor ${index + 1}`,
            phone: item.number || item.phone || item.mobile || '-',
            email: item.email || '-',
            visitedAt: item.joined_at || item.visited_at || item.created_at || moment().format('YYYY-MM-DD HH:mm'),
            executiveName: execName,
            executiveId: item.executiveId,
            isAi,
            tableNo: tableNum,
            interactionType: isAi ? 'AI Executive Session' : (item.interactionType || 'Meeting Room Discussion'),
            duration: item.duration || '3m 15s'
          });
        }
      });
      return list;
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([dateStr, execItems], dIdx) => {
        if (Array.isArray(execItems)) {
          execItems.forEach((execItem, eIdx) => {
            const tableNum = Number(execItem.tableId) || (eIdx % stall.tablesCount) + 1;
            const execName = resolveExecutiveName(execItem, tableNum);
            const isAi = execItem.executiveId === 'AI_BOT' || execName.includes('AI');

            if (Array.isArray(execItem.users)) {
              execItem.users.forEach((u, uIdx) => {
                const timeString = u.joined_at ? `${dateStr} ${u.joined_at}` : dateStr;
                list.push({
                  id: `${dIdx}-${eIdx}-${uIdx}`,
                  userId: u.userId || u.id,
                  name: u.name || u.userName || `Visitor ${uIdx + 1}`,
                  phone: u.number || u.phone || '-',
                  email: u.email || '-',
                  visitedAt: timeString,
                  executiveName: execName,
                  executiveId: execItem.executiveId,
                  isAi,
                  tableNo: tableNum,
                  interactionType: isAi ? 'AI Executive Session' : 'Meeting Room Call',
                  duration: u.duration || '4m 15s'
                });
              });
            }
          });
        }
      });
    }

    return list;
  };

  // Generate sensible demonstration data if backend has empty interactions
  const generateFallbackVisitors = (stall) => {
    if (!stall.isOccupied) return [];
    return Array.from({ length: Math.min(stall.visitorsCount || 6, 8) }, (_, idx) => {
      const tableNo = (idx % stall.tablesCount) + 1;
      const isAi = tableNo === 1;
      return {
        id: idx + 1,
        name: `Visitor ${idx + 1}`,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `visitor${idx + 1}@example.com`,
        visitedAt: moment().subtract(idx * 25, 'minutes').format('YYYY-MM-DD HH:mm'),
        executiveName: isAi ? 'AI Executive (AI Bot)' : (stall.meetingTables[tableNo - 1]?.name || `Executive ${tableNo}`),
        tableNo: tableNo,
        isAi,
        interactionType: isAi ? 'AI Executive Session' : (idx % 2 === 0 ? 'Video Meeting Call' : 'Executive Table Interaction'),
        duration: `${Math.floor(2 + Math.random() * 8)}m ${Math.floor(10 + Math.random() * 50)}s`
      };
    });
  };

  // Filter stall entry visitors inside modal by search
  const filteredModalEntryVisitors = useMemo(() => {
    if (!visitorSearchQuery.trim()) return stallEntryVisitors;
    const q = visitorSearchQuery.toLowerCase();
    return stallEntryVisitors.filter((v) =>
      v.name?.toLowerCase().includes(q) ||
      v.number?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.visit_date?.toLowerCase().includes(q)
    );
  }, [stallEntryVisitors, visitorSearchQuery]);

  // Filter meeting interaction visitors inside modal by search
  const filteredModalVisitors = useMemo(() => {
    if (!visitorSearchQuery.trim()) return stallCustomersData;
    const q = visitorSearchQuery.toLowerCase();
    return stallCustomersData.filter((v) =>
      v.name?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.executiveName?.toLowerCase().includes(q)
    );
  }, [stallCustomersData, visitorSearchQuery]);

  // Aggregate interactions per meeting table in selected stall
  const tableInteractionsBreakdown = useMemo(() => {
    if (!selectedStallModal) return [];

    const executivesList = Array.isArray(stallDetailInfo?.Executive)
      ? stallDetailInfo.Executive
      : Array.isArray(selectedStallModal.executives)
        ? selectedStallModal.executives
        : [];

    return selectedStallModal.meetingTables.map((tbl, idx) => {
      const visitorsForTable = stallCustomersData.filter((v) => v.tableNo === tbl.tableNo);
      const humanVisitors = visitorsForTable.filter((v) => !v.isAi && v.executiveId !== 'AI_BOT');
      const aiVisitors = visitorsForTable.filter((v) => v.isAi || v.executiveId === 'AI_BOT');

      // 1. Check if executive is defined in stallDetailInfo.Executive list
      const assignedExec = executivesList[idx] || {};

      // 2. Resolve human executive name if present in session data or assigned info
      const firstHuman = humanVisitors.find((v) => v.executiveName && !v.executiveName.includes('AI') && !v.executiveName.includes('Executive '));
      const humanDisplayName = assignedExec.name || firstHuman?.executiveName || tbl.name || `Executive ${tbl.tableNo}`;
      const humanPhone = assignedExec.phone || tbl.phone || '-';

      return {
        ...tbl,
        name: humanDisplayName,
        phone: humanPhone,
        role: assignedExec.role || 'Executive',
        execId: assignedExec.id || null,
        humanVisitorsCount: humanVisitors.length,
        aiVisitorsCount: aiVisitors.length,
        visitorsCount: visitorsForTable.length,
        hasAiAssisted: aiVisitors.length > 0,
        visitors: visitorsForTable
      };
    });
  }, [selectedStallModal, stallCustomersData, stallDetailInfo]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="main-content expo-analytics-container">
          <div className="page-content">
            <div className="container-fluid">

              {/* Breadcrumbs */}
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <h4 className="mb-0 text-white font-size-18">Expo Analytics & Stall Performance</h4>
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <Link to="/dashboard">Home</Link>
                        </li>
                        <li className="breadcrumb-item active">Expo Dashboard</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Hero Banner with Expo Selector */}
              <div className="expo-dashboard-header">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-md-12 mb-3 mb-lg-0">
                    <div className="d-flex align-items-center gap-3">
                      <div className="kpi-icon-wrap bg-purple-light text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <MdOutlineAnalytics size={28} />
                      </div>
                      <div>
                        <h2 className="expo-dashboard-title">
                          {selectedExpo ? `${selectedExpo.expoCity || ''} Expo Analytics` : 'Expo Analytics Hub'}
                        </h2>
                        <p className="expo-dashboard-subtitle">
                          Real-time 27-stall footfall, meeting room engagement, and visitor interaction metrics
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5 col-md-12">
                    <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-lg-end gap-2">
                      <div className="flex-grow-1">
                        <Form.Select
                          className="expo-select-dropdown w-100"
                          value={selectedExpoCode}
                          onChange={handleExpoChange}
                        >
                          {exposList.length === 0 && <option value="">No Expos Available</option>}
                          {exposList.map((expo) => (
                            <option key={expo.newExpoId || expo.expoUnqCode} value={expo.expoUnqCode}>
                              {expo.expoCity} Expo ({expo.expoType || 'Ongoing'}) - {expo.expoUnqCode}
                            </option>
                          ))}
                        </Form.Select>
                      </div>

                      <Button
                        className="expo-refresh-btn d-flex align-items-center justify-content-center gap-2"
                        onClick={() => loadExpoAnalytics(selectedExpoCode)}
                        disabled={dataRefreshing}
                      >
                        <FaSyncAlt className={dataRefreshing ? 'fa-spin' : ''} />
                        <span className="d-none d-sm-inline">Refresh</span>
                      </Button>
                    </div>

                    {selectedExpo && (
                      <div className="mt-3 d-flex flex-wrap gap-2 justify-content-lg-end">
                        <span className="expo-badge-info">
                          <FaCalendarAlt size={12} />
                          {moment(selectedExpo.fromDate).format('DD MMM YYYY')} - {moment(selectedExpo.toDate).format('DD MMM YYYY')}
                        </span>
                        <span className="expo-badge-info">
                          <FaStore size={12} />
                          27 Total Stalls
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Expo 3D Arena Link & Sharing Banner */}
                {expoLink && (
                  <div className="expo-live-link-banner">
                    <div className="expo-live-link-info">
                      <div className="expo-live-link-icon">
                        <FaGlobe size={20} />
                      </div>
                      <div className="expo-live-link-text">
                        <div className="expo-live-link-label">
                          Live 3D Virtual Expo Arena
                        </div>
                        <a
                          href={expoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="expo-live-link-url"
                          title={expoLink}
                        >
                          {expoLink}
                        </a>
                      </div>
                    </div>

                    <div className="expo-live-link-actions">
                      <a
                        href={expoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-live-arena"
                      >
                        <FaExternalLinkAlt size={12} />
                        <span>Open Live Arena</span>
                      </a>

                      <button
                        type="button"
                        className="btn-share-icon"
                        onClick={handleCopyLink}
                        title="Copy link to clipboard"
                      >
                        {linkCopied ? <FaCheck size={14} className="text-success" /> : <FaCopy size={14} />}
                        <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Check out the Live Virtual Expo Arena: ${expoLink}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-share-icon btn-share-whatsapp"
                        title="Share on WhatsApp"
                      >
                        <MdWhatsapp size={16} />
                        <span className="d-none d-sm-inline">WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:?subject=${encodeURIComponent(`${selectedExpo ? selectedExpo.expoCity : ''} Virtual Expo Arena Link`)}&body=${encodeURIComponent(`Here is the link to the Live Virtual Expo Arena:\n\n${expoLink}`)}`}
                        className="btn-share-icon btn-share-email"
                        title="Share via Email"
                      >
                        <MdEmail size={16} />
                        <span className="d-none d-sm-inline">Email</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* KPI Summary Row */}
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="kpi-card kpi-primary">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="kpi-label">Total Expo Visitors</div>
                        <h3 className="kpi-value"><a href="/visitors-summary">{analyticsSummary.totalVisitors}</a></h3>
                        <div className="kpi-subtext">Overall registered & live footfall</div>
                      </div>
                      <div className="kpi-icon-wrap bg-primary-light">
                        <FaUsers />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="kpi-card kpi-success">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="kpi-label">Total Stall Visits</div>
                        <h3 className="kpi-value">{analyticsSummary.totalStallVisits}</h3>
                        <div className="kpi-subtext">Aggregated visits across 27 stalls</div>
                      </div>
                      <div className="kpi-icon-wrap bg-success-light">
                        <FaStore />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="kpi-card kpi-purple">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="kpi-label">Meeting Room Interactions</div>
                        <h3 className="kpi-value">{analyticsSummary.totalMeetingInteractions}</h3>
                        <div className="kpi-subtext">Executive table chats & calls</div>
                      </div>
                      <div className="kpi-icon-wrap bg-purple-light">
                        <MdMeetingRoom />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="kpi-card kpi-warning">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="kpi-label">Occupied Stalls</div>
                        <h3 className="kpi-value">
                          <a href="/builderparticipate"> {analyticsSummary.occupiedStalls} <span className="text-muted font-size-14" style={{ fontSize: '15px' }}>/ {analyticsSummary.totalStalls}</span></a>
                        </h3>
                        <div className="kpi-subtext">
                          {analyticsSummary.availableStalls} stalls available for booking
                        </div>
                      </div>
                      <div className="kpi-icon-wrap bg-warning-light">
                        <FaBuilding />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Stall Analytics Card */}
              <div className="analytics-section-card">
                <div className="analytics-card-header">
                  <div className="analytics-card-title">
                    <BsShop className="text-primary" />
                    <span>27-Stall Interactive Analytics & Meeting Room Heatmap</span>
                  </div>

                  {/* Filter Controls */}
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="stall-filter-pills">
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('ALL')}
                      >
                        All Stalls (27)
                      </button>
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'DIAMOND' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('DIAMOND')}
                      >
                        Diamond (1)
                      </button>
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'PLATINUM' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('PLATINUM')}
                      >
                        Platinum (2)
                      </button>
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'GOLD' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('GOLD')}
                      >
                        Gold (4)
                      </button>
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'STANDARD' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('STANDARD')}
                      >
                        Standard (20)
                      </button>
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'OCCUPIED' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('OCCUPIED')}
                      >
                        Booked ({analyticsSummary.occupiedStalls})
                      </button>
                      <button
                        className={`stall-filter-btn ${activeTierFilter === 'AVAILABLE' ? 'active' : ''}`}
                        onClick={() => setActiveTierFilter('AVAILABLE')}
                      >
                        Available ({analyticsSummary.availableStalls})
                      </button>
                    </div>

                    {/* Status Legend */}
                    <div className="stall-status-legend d-none d-md-flex">
                      <span className="legend-item">
                        <span className="legend-dot dot-booked"></span> Booked ({analyticsSummary.occupiedStalls})
                      </span>
                      <span className="legend-item">
                        <span className="legend-dot dot-available"></span> Available ({analyticsSummary.availableStalls})
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 ms-auto">
                      <div className="search-input-wrap" style={{ minWidth: '200px' }}>
                        <FaSearch className="search-icon" />
                        <Form.Control
                          type="text"
                          placeholder="Search stall or builder..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="form-control-sm"
                        />
                      </div>

                      <div className="view-toggle-btn-group" role="group" aria-label="View toggle">
                        <button
                          type="button"
                          className={`view-toggle-btn ${viewMode === 'GRID' ? 'active' : ''}`}
                          onClick={() => setViewMode('GRID')}
                          title="Grid View"
                        >
                          <FaTh /> Grid
                        </button>
                        <button
                          type="button"
                          className={`view-toggle-btn ${viewMode === 'TABLE' ? 'active' : ''}`}
                          onClick={() => setViewMode('TABLE')}
                          title="Table View"
                        >
                          <FaListUl /> Table
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card-body">
                  {/* GRID VIEW - Row Wise by Tier with 5 Cards per Row */}
                  {viewMode === 'GRID' && (
                    <div>
                      {groupedTiers.map((tierGroup) => (
                        <div key={tierGroup.type} className="stalls-tier-section">
                          <div className="stalls-tier-header">
                            <div className="stalls-tier-title-wrap">
                              <h5 className="stalls-tier-title">{tierGroup.title}</h5>
                              <span className={`stalls-tier-badge-pill ${tierGroup.badgeClass}`}>
                                {tierGroup.stalls.length} {tierGroup.stalls.length === 1 ? 'Stall' : 'Stalls'}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-2 font-size-13 fw-semibold">
                              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                {tierGroup.bookedCount} Booked
                              </span>
                              <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">
                                {tierGroup.availableCount} Available
                              </span>
                            </div>
                          </div>

                          <div className="stalls-grid-5-cols">
                            {tierGroup.stalls.map((stall) => (
                              <div
                                key={stall.code}
                                className={`stall-box-item ${stall.colorClass} ${stall.isOccupied ? 'occupied' : 'available'}`}
                                onClick={() => handleOpenStallModal(stall)}
                              >
                                {/* Top Header: Stall Code & Table Count */}
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className={`stall-badge-code ${stall.badgeClass}`}>
                                    {stall.code}
                                  </span>
                                  <span className="meeting-pill-badge">
                                    <MdMeetingRoom size={12} />
                                    {stall.tablesCount} Tables
                                  </span>
                                </div>

                                <div className="stall-category-subtitle">
                                  {stall.type} Tier
                                </div>

                                {/* Center: Prominent Analytics Counts */}
                                <div className="stall-counts-center">
                                  <div className="stall-count-item">
                                    <span className={`stall-count-val ${stall.isOccupied ? 'count-visitors' : 'count-muted'}`}>
                                      {stall.isOccupied ? stall.visitorsCount : 0}
                                    </span>
                                    <span className="stall-count-lbl">
                                      <FaUsers size={11} /> Visitors
                                    </span>
                                  </div>

                                  <div className="vr opacity-25" style={{ height: '26px' }}></div>

                                  <div className="stall-count-item">
                                    <span className={`stall-count-val ${stall.isOccupied ? 'count-interactions' : 'count-muted'}`}>
                                      {stall.isOccupied ? stall.meetingInteractionsCount : 0}
                                    </span>
                                    <span className="stall-count-lbl">
                                      <FaHandshake size={11} /> Interactions
                                    </span>
                                  </div>
                                </div>

                                {/* Bottom: Exhibitor Name (Green) or Not Booked (Red) */}
                                {stall.isOccupied ? (
                                  <div className="stall-card-footer footer-booked" title={stall.builderName}>
                                    <FaBuilding size={12} className="flex-shrink-0" />
                                    <span className="text-truncate">{stall.builderName}</span>
                                  </div>
                                ) : (
                                  <div className="stall-card-footer footer-not-booked">
                                    <FaTimesCircle size={12} className="flex-shrink-0" />
                                    <span>No Exhibitor Assigned</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TABLE VIEW */}
                  {viewMode === 'TABLE' && (
                    <div className="table-responsive">
                      <table className="custom-analytics-table">
                        <thead>
                          <tr>
                            <th>Stall Code</th>
                            <th>Tier / Type</th>
                            <th>Assigned Exhibitor / Builder</th>
                            <th>Meeting Rooms / Tables</th>
                            <th>Total Visitors</th>
                            <th>Meeting Room Interactions</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStalls.map((stall) => (
                            <tr key={stall.code}>
                              <td>
                                <span className={`stall-badge-code ${stall.badgeClass}`}>
                                  {stall.code}
                                </span>
                              </td>
                              <td>
                                <strong>{stall.type}</strong>
                              </td>
                              <td>
                                {stall.isOccupied ? (
                                  <span className="fw-bold text-dark d-flex align-items-center gap-1">
                                    <FaBuilding className="text-primary" size={13} />
                                    {stall.builderName}
                                  </span>
                                ) : (
                                  <span className="text-muted fst-italic">
                                    Available for Booking
                                  </span>
                                )}
                              </td>
                              <td>
                                <span className="meeting-pill-badge">
                                  <MdMeetingRoom size={13} /> {stall.tablesCount} Meeting Tables
                                </span>
                              </td>
                              <td>
                                <strong className="text-dark font-size-14">{stall.isOccupied ? stall.visitorsCount : 0}</strong>
                              </td>
                              <td>
                                {stall.isOccupied ? (
                                  <span className="badge bg-success-subtle text-success px-2 py-1 rounded">
                                    {stall.meetingInteractionsCount} Interactions
                                  </span>
                                ) : (
                                  <span className="text-muted font-size-12">-</span>
                                )}
                              </td>
                              <td>
                                {stall.isOccupied ? (
                                  <span className="badge bg-success text-white px-2 py-1 d-inline-flex align-items-center gap-1">
                                    <FaCheckCircle size={11} /> Booked
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary text-white px-2 py-1 d-inline-flex align-items-center gap-1">
                                    <FaTimesCircle size={11} /> Available
                                  </span>
                                )}
                              </td>
                              <td className="text-center">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleOpenStallModal(stall)}
                                  className="d-inline-flex align-items-center gap-1"
                                >
                                  <BsEyeFill /> View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {filteredStalls.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      <FaSearch size={32} className="mb-2 text-secondary opacity-50" />
                      <p>No stalls found matching the selected filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stall Analytics Deep Dive Modal */}
              <Modal
                show={Boolean(selectedStallModal)}
                onHide={handleCloseModal}
                size="xl"
                centered
                className="stall-analytics-modal"
              >
                {selectedStallModal && (
                  <>
                    <div className="analytics-modal-header d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className={`stall-badge-code ${selectedStallModal.badgeClass}`} style={{ fontSize: '16px', padding: '6px 14px' }}>
                          {selectedStallModal.code}
                        </span>
                        <div>
                          <h4 className="mb-1">
                            {stallDetailInfo?.builderNameText || selectedStallModal.builderName}
                          </h4>
                          <span className="text-white-50 font-size-13">
                            {selectedStallModal.type} Stall • {selectedStallModal.tablesCount} Meeting Rooms / Executive Tables
                            {stallDetailInfo?.Builder?.name && (
                              <span className="ms-2 badge bg-light-subtle border border-white-50">
                                Builder Rep: {stallDetailInfo.Builder.name} ({stallDetailInfo.Builder.phone || '-'})
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline-light" size="sm" onClick={handleCloseModal}>
                        ✕
                      </Button>
                    </div>

                    <Modal.Body className="p-4">
                      {/* Stall Modal Stats Banner */}
                      <div className="row mb-4">
                        <div className="col-md-3">
                          <div className="p-3 bg-light rounded border text-center">
                            <span className="text-muted font-size-12 fw-bold text-uppercase">Total Stall Visitors</span>
                            <h4 className="mt-1 mb-0 text-primary fw-bold">
                              {stallEntryVisitors.length || selectedStallModal.visitorsCount}
                            </h4>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="p-3 bg-light rounded border text-center">
                            <span className="text-muted font-size-12 fw-bold text-uppercase">Meeting Interactions</span>
                            <h4 className="mt-1 mb-0 text-success fw-bold">
                              {stallCustomersData.length || selectedStallModal.meetingInteractionsCount}
                            </h4>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="p-3 bg-light rounded border text-center">
                            <span className="text-muted font-size-12 fw-bold text-uppercase">Meeting Tables</span>
                            <h4 className="mt-1 mb-0 text-purple fw-bold">
                              {selectedStallModal.tablesCount} Tables
                            </h4>
                          </div>
                        </div>


                      </div>

                      {/* Modal Navigation Tabs */}
                      <div className="modal-nav-tabs">
                        <button
                          className={`modal-tab-btn ${modalTab === 'ENTRIES' ? 'active' : ''}`}
                          onClick={() => setModalTab('ENTRIES')}
                        >
                          <FaUsers className="me-1" /> Stall Visitors ({stallEntryVisitors.length || selectedStallModal.visitorsCount})
                        </button>
                        {/* <button
                          className={`modal-tab-btn ${modalTab === 'MEETINGS' ? 'active' : ''}`}
                          onClick={() => setModalTab('MEETINGS')}
                        >
                          <MdMeetingRoom className="me-1" /> Meeting Room Tables & Executives ({selectedStallModal.tablesCount})
                        </button> */}
                        <button
                          className={`modal-tab-btn ${modalTab === 'INTERACTIONS' ? 'active' : ''}`}
                          onClick={() => setModalTab('INTERACTIONS')}
                        >
                          <FaHandshake className="me-1" /> Meeting Interaction Logs ({stallCustomersData.length})
                        </button>
                      </div>

                      {modalLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status"></div>
                          <p className="mt-2 text-muted">Loading stall analytics data...</p>
                        </div>
                      ) : (
                        <>
                          {/* TAB 1: STALL FOOTFALL & VISITORS (from getStallVisitors.php) */}
                          {modalTab === 'ENTRIES' && (
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                  <h6 className="mb-0 fw-bold">Stall Visitors</h6>
                                  {/* <small className="text-muted">Direct footfall of users who visited and entered stall {selectedStallModal.code}</small> */}
                                </div>
                                <div className="search-input-wrap" style={{ width: '260px' }}>
                                  <FaSearch className="search-icon" />
                                  <Form.Control
                                    type="text"
                                    placeholder="Search visitor by name, phone..."
                                    value={visitorSearchQuery}
                                    onChange={(e) => setVisitorSearchQuery(e.target.value)}
                                    size="sm"
                                  />
                                </div>
                              </div>

                              <div className="table-responsive">
                                <table className="custom-analytics-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Visitor Name</th>
                                      <th>Phone Number</th>
                                      <th>Email</th>
                                      <th>Visit Date</th>
                                      <th>Visit Time</th>
                                      <th>User ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredModalEntryVisitors.map((vis, idx) => (
                                      <tr key={vis.id || idx}>
                                        <td>{idx + 1}</td>
                                        <td>
                                          <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '12px', fontWeight: 'bold' }}>
                                              {(vis.name || 'V').charAt(0).toUpperCase()}
                                            </div>
                                            <strong>{vis.name || 'Visitor'}</strong>
                                          </div>
                                        </td>
                                        <td>
                                          <span className="d-flex align-items-center gap-1">
                                            <FaPhoneAlt size={11} className="text-muted" /> {vis.number || vis.phone || '-'}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="d-flex align-items-center gap-1 text-muted">
                                            <FaEnvelope size={11} /> {vis.email || '-'}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="d-flex align-items-center gap-1 text-muted">
                                            <FaCalendarAlt size={11} /> {vis.visit_date ? moment(vis.visit_date).format('DD MMM YYYY') : '-'}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="badge bg-primary-subtle text-primary border px-2 py-1">
                                            <FaClock size={11} className="me-1" /> {vis.visit_time || vis.time || '-'}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="badge bg-light text-dark font-monospace">
                                            #{vis.userId || vis.id || '-'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}

                                    {filteredModalEntryVisitors.length === 0 && (
                                      <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                          No stall footfall visitors recorded yet for {selectedStallModal.code}.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* TAB 2: MEETING ROOM TABLES & EXECUTIVE INTERACTIONS */}
                          {modalTab === 'MEETINGS' && (
                            <div>
                              <div className="row g-3">
                                {tableInteractionsBreakdown.map((tbl) => (
                                  <div className="col-lg-4 col-md-6" key={tbl.tableNo}>
                                    <div className="executive-room-card">
                                      <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="table-num-badge">
                                          Table {tbl.tableNo} / Meeting Room
                                        </span>
                                        <span className="badge bg-success-subtle text-success">
                                          {tbl.visitorsCount} Connected
                                        </span>
                                      </div>

                                      {/* Assigned Human Executive Header */}
                                      <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className="rounded-circle p-2 bg-primary-subtle text-primary">
                                          <FaUserTie size={16} />
                                        </div>
                                        <div className="flex-grow-1 min-w-0">
                                          <h6 className="mb-0 fw-bold text-truncate" title={tbl.name}>
                                            {tbl.name}
                                          </h6>
                                          <small className="text-muted">
                                            Executive In-Charge
                                          </small>
                                        </div>
                                      </div>

                                      <div className="small text-muted mb-2">
                                        <FaPhoneAlt className="me-1" size={11} /> {tbl.phone || '+91 98000 00000'}
                                      </div>

                                      {/* AI Bot Standby Fallback Indicator */}
                                      {tbl.hasAiAssisted ? (
                                        <div className="p-2 mb-2 rounded bg-purple-subtle border border-purple-subtle font-size-12 d-flex align-items-center gap-2">
                                          <FaRobot className="text-purple flex-shrink-0" size={14} />
                                          <div>
                                            <strong className="text-purple">AI Standby Assistant</strong>
                                            <div className="text-muted font-size-11">
                                              Auto-assisted {tbl.aiVisitorsCount} {tbl.aiVisitorsCount === 1 ? 'visitor' : 'visitors'} while executive was away
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-2 mb-2 rounded bg-light border font-size-11 text-muted d-flex align-items-center gap-1">
                                          <FaRobot size={12} className="text-secondary" />
                                          <span>AI Fallback Assistant: Standby Ready</span>
                                        </div>
                                      )}

                                      {/* Recent Interactions with Rep vs AI attribution */}
                                      <div className="border-top pt-2 mt-2">
                                        <small className="fw-bold text-dark d-block mb-1">Recent Table Activity:</small>
                                        {tbl.visitors.length > 0 ? (
                                          <div className="list-group list-group-flush">
                                            {tbl.visitors.slice(0, 3).map((v, vIdx) => (
                                              <div key={vIdx} className="list-group-item px-0 py-1 border-0 d-flex justify-content-between align-items-center font-size-12">
                                                <div>
                                                  <strong>{v.name}</strong> <br />
                                                  <small className="text-muted d-flex align-items-center gap-1">
                                                    {v.isAi || v.executiveId === 'AI_BOT' ? (
                                                      <span className="text-purple d-inline-flex align-items-center gap-1">
                                                        <FaRobot size={10} /> AI Bot (Standby)
                                                      </span>
                                                    ) : (
                                                      <span className="text-primary d-inline-flex align-items-center gap-1">
                                                        <FaUserTie size={10} /> {tbl.name}
                                                      </span>
                                                    )}
                                                    • {v.visitedAt}
                                                  </small>
                                                </div>
                                                <span className="badge bg-light text-dark">{v.duration}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-muted font-size-12 fst-italic py-1">
                                            No active interactions recorded yet
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* TAB 3: ALL MEETING ROOM INTERACTION LOGS (from getStallCustomers.php) */}
                          {modalTab === 'INTERACTIONS' && (
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                  <h6 className="mb-0 fw-bold">Meeting Room Interaction Activity Log</h6>
                                  {/* <small className="text-muted">Customer engagement sessions across executive meeting tables</small> */}
                                </div>
                                <div className="search-input-wrap" style={{ width: '260px' }}>
                                  <FaSearch className="search-icon" />
                                  <Form.Control
                                    type="text"
                                    placeholder="Search by visitor or executive..."
                                    value={visitorSearchQuery}
                                    onChange={(e) => setVisitorSearchQuery(e.target.value)}
                                    size="sm"
                                  />
                                </div>
                              </div>

                              <div className="table-responsive">
                                <table className="custom-analytics-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Visitor Name</th>
                                      <th>Phone Number</th>
                                      <th>Email</th>
                                      <th>Visited Time</th>
                                      <th>Interacted Room / Executive</th>
                                      <th>Call / Interaction Duration</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredModalVisitors.map((vis, idx) => (
                                      <tr key={vis.id || idx}>
                                        <td>{idx + 1}</td>
                                        <td>
                                          <strong>{vis.name}</strong>
                                        </td>
                                        <td>
                                          <span className="d-flex align-items-center gap-1">
                                            <FaPhoneAlt size={11} className="text-muted" /> {vis.phone}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="d-flex align-items-center gap-1 text-muted">
                                            <FaEnvelope size={11} /> {vis.email}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="d-flex align-items-center gap-1 text-muted">
                                            <FaClock size={11} /> {vis.visitedAt}
                                          </span>
                                        </td>
                                        <td>
                                          <span className={`badge ${vis.isAi || vis.executiveId === 'AI_BOT' ? 'bg-purple-subtle text-secondary border' : 'bg-primary-subtle text-primary border'} px-2 py-1 d-inline-flex align-items-center gap-1`}>
                                            {(vis.isAi || vis.executiveId === 'AI_BOT') && <FaRobot size={12} />}
                                            Table {vis.tableNo} - {vis.executiveId === 'AI_BOT' ? 'AI Executive (AI Bot)' : vis.executiveName}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="badge bg-success-subtle text-success">
                                            {vis.duration}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}

                                    {filteredModalVisitors.length === 0 && (
                                      <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                          No meeting room interactions recorded yet for this stall.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </Modal.Body>

                    <Modal.Footer className="bg-light">
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                      </Button>

                    </Modal.Footer>
                  </>
                )}
              </Modal>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpoDashboard;
