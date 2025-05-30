
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileCode, 
  Play, 
  Pause,
  Settings,
  Shield,
  Eye,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Code,
  Zap,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface SmartContractsProps {
  lang?: 'en' | 'ar';
}

const SmartContracts = ({ lang = 'ar' }: SmartContractsProps) => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [deploymentNetwork, setDeploymentNetwork] = useState('ethereum');

  // العقود الذكية المنشورة
  const deployedContracts = [
    {
      id: '1',
      name: 'Advanced Trading Bot',
      address: '0x742d35Cc6bF8...14b2e967',
      network: 'Ethereum',
      status: 'active',
      type: 'Trading Automation',
      gasUsed: 1456789,
      transactions: 234,
      totalValue: 125000,
      createdAt: '2024-01-15',
      lastExecuted: '2024-01-20 14:30',
      functions: [
        { name: 'executeTrade', calls: 89, gasAvg: 65000 },
        { name: 'setStopLoss', calls: 45, gasAvg: 32000 },
        { name: 'rebalancePortfolio', calls: 23, gasAvg: 128000 }
      ],
      verified: true
    },
    {
      id: '2',
      name: 'DeFi Yield Optimizer',
      address: '0x9f8a2c3e1d7b...8f2a1c9e',
      network: 'Polygon',
      status: 'active',
      type: 'Yield Farming',
      gasUsed: 892345,
      transactions: 156,
      totalValue: 89000,
      createdAt: '2024-01-10',
      lastExecuted: '2024-01-20 12:15',
      functions: [
        { name: 'compound', calls: 67, gasAvg: 45000 },
        { name: 'harvest', calls: 34, gasAvg: 72000 },
        { name: 'rebalance', calls: 12, gasAvg: 156000 }
      ],
      verified: true
    },
    {
      id: '3',
      name: 'Risk Management System',
      address: '0x3e7b9f2c5a8d...4e1f9c7b',
      network: 'Arbitrum',
      status: 'paused',
      type: 'Risk Management',
      gasUsed: 567890,
      transactions: 78,
      totalValue: 45000,
      createdAt: '2024-01-08',
      lastExecuted: '2024-01-19 09:45',
      functions: [
        { name: 'checkRisk', calls: 45, gasAvg: 28000 },
        { name: 'emergencyStop', calls: 2, gasAvg: 85000 },
        { name: 'updateLimits', calls: 12, gasAvg: 41000 }
      ],
      verified: false
    }
  ];

  // قوالب العقود الذكية
  const contractTemplates = [
    {
      id: 'trading-bot',
      name: lang === 'ar' ? 'روبوت التداول المتقدم' : 'Advanced Trading Bot',
      description: lang === 'ar' 
        ? 'عقد ذكي للتداول الآلي مع إدارة المخاطر'
        : 'Smart contract for automated trading with risk management',
      category: 'Trading',
      complexity: 'Advanced',
      estimatedGas: 850000,
      features: [
        'Multi-exchange support',
        'Stop-loss automation',
        'Portfolio rebalancing',
        'Risk limits enforcement'
      ]
    },
    {
      id: 'yield-farming',
      name: lang === 'ar' ? 'محسن العائد DeFi' : 'DeFi Yield Optimizer',
      description: lang === 'ar'
        ? 'عقد ذكي لتحسين العوائد في بروتوكولات DeFi'
        : 'Smart contract for optimizing yields in DeFi protocols',
      category: 'DeFi',
      complexity: 'Intermediate',
      estimatedGas: 650000,
      features: [
        'Auto-compounding',
        'Cross-protocol farming',
        'Gas optimization',
        'Emergency withdrawal'
      ]
    },
    {
      id: 'portfolio-manager',
      name: lang === 'ar' ? 'مدير المحفظة الذكي' : 'Smart Portfolio Manager',
      description: lang === 'ar'
        ? 'عقد ذكي لإدارة المحافظ الاستثمارية تلقائياً'
        : 'Smart contract for automated portfolio management',
      category: 'Portfolio',
      complexity: 'Expert',
      estimatedGas: 1200000,
      features: [
        'Dynamic rebalancing',
        'Multi-asset support',
        'Risk-based allocation',
        'Performance tracking'
      ]
    }
  ];

  // إحصائيات العقود الذكية
  const contractStats = {
    totalContracts: 12,
    activeContracts: 9,
    totalTransactions: 1567,
    totalGasUsed: 4.2,
    totalValue: 259000,
    successRate: 98.7
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'stopped': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/30 border-green-700 text-green-300';
      case 'paused': return 'bg-yellow-900/30 border-yellow-700 text-yellow-300';
      case 'stopped': return 'bg-red-900/30 border-red-700 text-red-300';
      default: return 'bg-gray-900/30 border-gray-700 text-gray-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleDeployContract = (templateId: string) => {
    console.log(`Deploying contract template: ${templateId}`);
  };

  const handleContractAction = (contractId: string, action: string) => {
    console.log(`${action} contract: ${contractId}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileCode className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{contractStats.totalContracts}</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'إجمالي العقود' : 'Total Contracts'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{contractStats.activeContracts}</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'عقود نشطة' : 'Active Contracts'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  ${contractStats.totalValue.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'إجمالي القيمة' : 'Total Value'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{contractStats.successRate}%</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'معدل النجاح' : 'Success Rate'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="deployed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="deployed">
            {lang === 'ar' ? 'العقود المنشورة' : 'Deployed Contracts'}
          </TabsTrigger>
          <TabsTrigger value="templates">
            {lang === 'ar' ? 'القوالب' : 'Templates'}
          </TabsTrigger>
          <TabsTrigger value="deploy">
            {lang === 'ar' ? 'نشر عقد' : 'Deploy Contract'}
          </TabsTrigger>
          <TabsTrigger value="monitor">
            {lang === 'ar' ? 'المراقبة' : 'Monitoring'}
          </TabsTrigger>
        </TabsList>

        {/* Deployed Contracts */}
        <TabsContent value="deployed" className="space-y-6">
          <div className="space-y-4">
            {deployedContracts.map((contract) => (
              <Card key={contract.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">{contract.name}</h3>
                        <Badge className={getStatusBadge(contract.status)}>
                          {contract.status}
                        </Badge>
                        {contract.verified && (
                          <Badge className="bg-blue-900/30 border-blue-700 text-blue-300">
                            <Shield className="h-3 w-3 mr-1" />
                            {lang === 'ar' ? 'موثق' : 'Verified'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm space-y-1">
                        <div>
                          {lang === 'ar' ? 'العنوان:' : 'Address:'} 
                          <code className="ml-2 text-blue-400">{contract.address}</code>
                        </div>
                        <div>
                          {lang === 'ar' ? 'الشبكة:' : 'Network:'} {contract.network} • 
                          {lang === 'ar' ? 'النوع:' : 'Type:'} {contract.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                        onClick={() => setSelectedContract(contract.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {lang === 'ar' ? 'عرض' : 'View'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                        onClick={() => handleContractAction(contract.id, contract.status === 'active' ? 'pause' : 'resume')}
                      >
                        {contract.status === 'active' ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            {lang === 'ar' ? 'إيقاف' : 'Pause'}
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            {lang === 'ar' ? 'تشغيل' : 'Resume'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-green-400 text-lg font-bold">{contract.transactions}</div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'المعاملات' : 'Transactions'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-blue-400 text-lg font-bold">
                        ${contract.totalValue.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'إجمالي القيمة' : 'Total Value'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-yellow-400 text-lg font-bold">
                        {(contract.gasUsed / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'غاز مستخدم' : 'Gas Used'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-purple-400 text-lg font-bold">
                        {contract.functions.length}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'وظائف نشطة' : 'Active Functions'}
                      </div>
                    </div>
                  </div>

                  {selectedContract === contract.id && (
                    <div className="mt-4 p-3 bg-trading-secondary rounded-lg">
                      <h4 className="text-white font-medium mb-3">
                        {lang === 'ar' ? 'وظائف العقد' : 'Contract Functions'}
                      </h4>
                      <div className="space-y-2">
                        {contract.functions.map((func, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-blue-400" />
                              <span className="text-white font-mono text-sm">{func.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-400">
                                {lang === 'ar' ? 'استدعاءات:' : 'Calls:'} {func.calls}
                              </span>
                              <span className="text-gray-400">
                                {lang === 'ar' ? 'غاز متوسط:' : 'Avg Gas:'} {func.gasAvg.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contract Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {contractTemplates.map((template) => (
              <Card key={template.id} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{template.name}</h3>
                    <Badge className={`${getComplexityColor(template.complexity)} border`}>
                      {template.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">{template.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'الفئة:' : 'Category:'}
                      </span>
                      <span className="text-white">{template.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'غاز مقدر:' : 'Estimated Gas:'}
                      </span>
                      <span className="text-yellow-400">{template.estimatedGas.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'المميزات:' : 'Features:'}
                    </h4>
                    <div className="space-y-1">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDeployContract(template.id)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'نشر العقد' : 'Deploy Contract'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Deploy Contract */}
        <TabsContent value="deploy" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'نشر عقد ذكي جديد' : 'Deploy New Smart Contract'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {lang === 'ar' ? 'اسم العقد' : 'Contract Name'}
                  </label>
                  <Input
                    placeholder={lang === 'ar' ? 'أدخل اسم العقد' : 'Enter contract name'}
                    className="bg-trading-secondary border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {lang === 'ar' ? 'الشبكة' : 'Network'}
                  </label>
                  <select 
                    value={deploymentNetwork}
                    onChange={(e) => setDeploymentNetwork(e.target.value)}
                    className="w-full p-2 bg-trading-secondary border border-gray-700 rounded-md text-white"
                  >
                    <option value="ethereum">Ethereum Mainnet</option>
                    <option value="polygon">Polygon</option>
                    <option value="bsc">Binance Smart Chain</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="goerli">Goerli Testnet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  {lang === 'ar' ? 'كود العقد الذكي' : 'Smart Contract Code'}
                </label>
                <Textarea
                  placeholder={lang === 'ar' ? 'أدخل كود Solidity هنا...' : 'Enter Solidity code here...'}
                  className="bg-trading-secondary border-gray-700 text-white font-mono text-sm"
                  rows={10}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {lang === 'ar' ? 'حد الغاز' : 'Gas Limit'}
                  </label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    className="bg-trading-secondary border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {lang === 'ar' ? 'سعر الغاز (Gwei)' : 'Gas Price (Gwei)'}
                  </label>
                  <Input
                    type="number"
                    placeholder="20"
                    className="bg-trading-secondary border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {lang === 'ar' ? 'القيمة (ETH)' : 'Value (ETH)'}
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-trading-secondary border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'نشر العقد' : 'Deploy Contract'}
                </Button>
                <Button variant="outline" className="border-gray-600">
                  <Code className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'التحقق من الكود' : 'Verify Code'}
                </Button>
                <Button variant="outline" className="border-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'تحميل قالب' : 'Load Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Monitoring */}
        <TabsContent value="monitor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  {lang === 'ar' ? 'النشاط في الوقت الفعلي' : 'Real-time Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-trading-secondary rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm">
                          {lang === 'ar' ? `تنفيذ دالة executeTrade` : `Function executeTrade executed`}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {lang === 'ar' ? 'منذ' : ''} {Math.floor(Math.random() * 60)} {lang === 'ar' ? 'ثانية' : 'seconds ago'}
                        </div>
                      </div>
                      <Badge className="bg-green-900/30 border-green-700 text-green-300">
                        {lang === 'ar' ? 'نجح' : 'Success'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  {lang === 'ar' ? 'التنبيهات والتحذيرات' : 'Alerts & Warnings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-yellow-300 text-sm font-medium">
                        {lang === 'ar' ? 'استهلاك غاز عالي' : 'High Gas Consumption'}
                      </div>
                      <div className="text-yellow-200 text-xs">
                        {lang === 'ar' 
                          ? 'العقد Trading Bot يستهلك غاز أكثر من المعتاد'
                          : 'Trading Bot contract consuming more gas than usual'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                    <div>
                      <div className="text-red-300 text-sm font-medium">
                        {lang === 'ar' ? 'فشل في التنفيذ' : 'Execution Failed'}
                      </div>
                      <div className="text-red-200 text-xs">
                        {lang === 'ar' 
                          ? 'فشل في تنفيذ دالة rebalance في العقد Risk Management'
                          : 'Failed to execute rebalance function in Risk Management contract'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartContracts;
