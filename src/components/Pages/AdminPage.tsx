import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Database, 
  Users, 
  Wand2, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  Trash2,
  Shield
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTreeContext } from '../../context/TreeContext';
import { 
  calculateTreeStatistics, 
  TreeStatistics, 
  performHardReset, 
  createDataBackup, 
  formatBytes, 
  formatNumber 
} from '../../utils/adminUtils';
import DatabaseDebugger from '../DatabaseDebugger';
import { GitHubAuthStatus } from '../GitHubAuthStatus';

const AdminPage: React.FC = () => {
  const { nodes } = useTreeContext();
  const [statistics, setStatistics] = useState<TreeStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetOptions, setResetOptions] = useState({
    preserveSettings: false,
    createBackup: true,
  });

  // Calculate statistics on component mount and when nodes change
  useEffect(() => {
    const calculateStats = async () => {
      setIsLoading(true);
      try {
        const stats = calculateTreeStatistics(nodes);
        setStatistics(stats);
      } catch (error) {
        console.error('Error calculating statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateStats();
  }, [nodes]);

  const handleRefreshStats = () => {
    setStatistics(null);
    setIsLoading(true);
    setTimeout(() => {
      const stats = calculateTreeStatistics(nodes);
      setStatistics(stats);
      setIsLoading(false);
    }, 500);
  };

  const handleCreateBackup = async () => {
    await createDataBackup();
  };

  const handleHardReset = async () => {
    const success = await performHardReset(resetOptions);
    if (success) {
      setShowResetConfirm(false);
      // Reload the page to reflect the reset
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center h-48 sm:h-64 gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-base sm:text-lg text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <div className="text-center text-red-600 py-6">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Error Loading Statistics</h2>
          <p className="text-sm sm:text-base mb-4">Unable to calculate application statistics.</p>
          <Button onClick={handleRefreshStats} className="w-full sm:w-auto">Try Again</Button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="p-3 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System statistics and management tools</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" onClick={handleRefreshStats} className="flex-1 sm:flex-auto justify-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleCreateBackup} className="flex-1 sm:flex-auto justify-center">
            <Download className="h-4 w-4 mr-2" />
            Backup Data
          </Button>
        </div>
      </motion.div>

      {/* Overview Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Nodes</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatNumber(statistics.totalNodes)}</p>
            </div>
            <Database className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Tree Depth</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{statistics.maxDepth}</p>
              <p className="text-xs text-gray-500">Avg: {statistics.averageDepth}</p>
            </div>
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{formatBytes(statistics.storageUsage)}</p>
            </div>
            <Database className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Magic Wand Uses</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{formatNumber(statistics.magicWandUsage.totalCalls)}</p>
              <p className="text-xs text-gray-500">{statistics.magicWandUsage.successRate}% success</p>
            </div>
            <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
          </div>
        </Card>
      </motion.div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Tree Statistics */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-semibold">Tree Statistics</h2>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:px-6 md:pb-6 md:pt-0">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Total Nodes</span>
                  <span className="text-blue-600 font-bold">{formatNumber(statistics.totalNodes)}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Maximum Depth</span>
                  <span className="text-blue-600 font-bold">{statistics.maxDepth} levels</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Average Depth</span>
                  <span className="text-blue-600 font-bold">{statistics.averageDepth} levels</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Last Modified</span>
                  <span className="text-blue-600 font-bold">
                    {statistics.lastModified.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Magic Wand Statistics */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold">Magic Wand Usage</h2>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:px-6 md:pb-6 md:pt-0">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Total Calls</span>
                  <span className="text-orange-600 font-bold">{formatNumber(statistics.magicWandUsage.totalCalls)}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-orange-600 font-bold">{statistics.magicWandUsage.successRate}%</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Avg Children Generated</span>
                  <span className="text-orange-600 font-bold">{statistics.magicWandUsage.averageChildrenGenerated}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Last Used</span>
                  <span className="text-orange-600 font-bold">
                    {statistics.magicWandUsage.lastUsed 
                      ? statistics.magicWandUsage.lastUsed.toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Most Used Labels */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <h2 className="text-lg sm:text-xl font-semibold">Most Used Labels</h2>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:px-6 md:pb-6 md:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {statistics.mostUsedLabels.length > 0 ? (
                statistics.mostUsedLabels.map(({ label, count }, index) => (
                  <div key={label} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 py-0.5 sm:py-1 rounded font-medium">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium capitalize truncate max-w-[120px] sm:max-w-none">{label}</span>
                    </div>
                    <span className="text-green-600 font-bold">{count}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No label data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <Card className="border-red-300 bg-gradient-to-r from-red-50 to-pink-50">
          <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100 border-b border-red-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-red-200 rounded-full">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
              </div>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-red-700">Danger Zone</h2>
                <p className="text-xs sm:text-sm text-red-600">Proceed with extreme caution</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            {!showResetConfirm ? (
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="max-w-md mx-auto">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Reset Application Data</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Permanently delete all application data and return to initial state. This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400 transition-all duration-200 shadow-md hover:shadow-lg px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    Reset Application Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-6 bg-red-100 border-2 border-red-300 rounded-xl shadow-inner">
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-200 rounded-full mb-2 sm:mb-3">
                      <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-700" />
                    </div>
                    <h3 className="font-bold text-red-800 text-lg sm:text-xl mb-1 sm:mb-2">Confirm Hard Reset</h3>
                    <p className="text-sm sm:text-base text-red-700 leading-relaxed">
                      This will permanently delete all your trees, nodes, and settings. Are you absolutely sure?
                    </p>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
                    <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resetOptions.createBackup}
                        onChange={(e) => setResetOptions(prev => ({ ...prev, createBackup: e.target.checked }))}
                        className="rounded border-red-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-800">Create backup before reset</span>
                    </label>
                    
                    <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resetOptions.preserveSettings}
                        onChange={(e) => setResetOptions(prev => ({ ...prev, preserveSettings: e.target.checked }))}
                        className="rounded border-red-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-800">Preserve user settings</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <Button 
                    variant="destructive"
                    size="lg"
                    onClick={handleHardReset}
                    className="px-4 sm:px-8 py-2 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    Confirm Reset
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 sm:px-8 py-2 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base order-1 sm:order-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* GitHub Authentication Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-purple-300 bg-gradient-to-r from-purple-50 to-violet-50">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-violet-100 border-b border-purple-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-purple-200 rounded-full">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
              </div>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-purple-700">GitHub Authentication</h2>
                <p className="text-xs sm:text-sm text-purple-600">Manage GitHub sync credentials</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <GitHubAuthStatus showFullStatus={true} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Database Diagnostics Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-blue-200 rounded-full">
                <Database className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
              </div>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-700">Database Tools</h2>
                <p className="text-xs sm:text-sm text-blue-600">Troubleshoot IndexedDB issues</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <DatabaseDebugger />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminPage;
