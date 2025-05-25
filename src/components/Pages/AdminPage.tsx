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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Statistics</h2>
          <p className="mb-4">Unable to calculate application statistics.</p>
          <Button onClick={handleRefreshStats}>Try Again</Button>
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
      className="p-6 max-w-6xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System statistics and management tools</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleCreateBackup}>
            <Download className="h-4 w-4 mr-2" />
            Backup Data
          </Button>
        </div>
      </motion.div>

      {/* Overview Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Nodes</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(statistics.totalNodes)}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tree Depth</p>
              <p className="text-2xl font-bold text-green-600">{statistics.maxDepth}</p>
              <p className="text-xs text-gray-500">Avg: {statistics.averageDepth}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-purple-600">{formatBytes(statistics.storageUsage)}</p>
            </div>
            <Database className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Magic Wand Uses</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(statistics.magicWandUsage.totalCalls)}</p>
              <p className="text-xs text-gray-500">{statistics.magicWandUsage.successRate}% success</p>
            </div>
            <Wand2 className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </motion.div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tree Statistics */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Tree Statistics</h2>
              </div>
            </CardHeader>            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Nodes</span>
                  <span className="text-blue-600 font-bold">{formatNumber(statistics.totalNodes)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Maximum Depth</span>
                  <span className="text-blue-600 font-bold">{statistics.maxDepth} levels</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Depth</span>
                  <span className="text-blue-600 font-bold">{statistics.averageDepth} levels</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Last Modified</span>
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
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold">Magic Wand Usage</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Calls</span>
                  <span className="text-orange-600 font-bold">{formatNumber(statistics.magicWandUsage.totalCalls)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Success Rate</span>
                  <span className="text-orange-600 font-bold">{statistics.magicWandUsage.successRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Avg Children Generated</span>
                  <span className="text-orange-600 font-bold">{statistics.magicWandUsage.averageChildrenGenerated}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Last Used</span>
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
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold">Most Used Labels</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.mostUsedLabels.length > 0 ? (
                statistics.mostUsedLabels.map(({ label, count }, index) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                        #{index + 1}
                      </span>
                      <span className="font-medium capitalize">{label}</span>
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
          <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100 border-b border-red-200">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-red-200 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-700">Danger Zone</h2>
                <p className="text-red-600 text-sm">Proceed with extreme caution</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {!showResetConfirm ? (
              <div className="text-center space-y-6">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Reset Application Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Permanently delete all application data and return to initial state. This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400 transition-all duration-200 shadow-md hover:shadow-lg px-8 py-3"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    <Trash2 className="h-5 w-5 mr-3" />
                    Reset Application Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-red-100 border-2 border-red-300 rounded-xl shadow-inner">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-200 rounded-full mb-3">
                      <AlertTriangle className="h-8 w-8 text-red-700" />
                    </div>
                    <h3 className="font-bold text-red-800 text-xl mb-2">Confirm Hard Reset</h3>
                    <p className="text-red-700 leading-relaxed">
                      This will permanently delete all your trees, nodes, and settings. Are you absolutely sure?
                    </p>
                  </div>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resetOptions.createBackup}
                        onChange={(e) => setResetOptions(prev => ({ ...prev, createBackup: e.target.checked }))}
                        className="rounded border-red-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-800">Create backup before reset</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resetOptions.preserveSettings}
                        onChange={(e) => setResetOptions(prev => ({ ...prev, preserveSettings: e.target.checked }))}
                        className="rounded border-red-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-800">Preserve user settings</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="destructive"
                    size="lg"
                    onClick={handleHardReset}
                    className="px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Trash2 className="h-5 w-5 mr-3" />
                    Confirm Reset
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminPage;
