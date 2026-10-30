'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Bell, Shield, Save, Building2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [saving, setSaving] = useState(false);

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [publicDisplayName, setPublicDisplayName] = useState('');

  // Notification prefs (client-side localStorage for demo)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderDigest, setReminderDigest] = useState(true);
  const [campaignUpdates, setCampaignUpdates] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth'); return; }
    if (profile) {
      setDisplayName(profile.display_name || '');
      setInstitution(profile.institution || '');
      setCourse(profile.course || '');
      setGraduationYear(profile.graduation_year ? String(profile.graduation_year) : '');
      setAvatarUrl(profile.avatar_url || '');
      setPublicDisplayName(profile.public_display_name || '');
    }
    // Load notification prefs from localStorage
    const prefs = localStorage.getItem('edufund-notif-prefs');
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        setEmailNotifications(p.email ?? true);
        setReminderDigest(p.digest ?? true);
        setCampaignUpdates(p.campaign ?? true);
      } catch {}
    }
  }, [profile, authLoading, user, router]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        institution: institution.trim() || null,
        course: course.trim() || null,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        avatar_url: avatarUrl.trim() || null,
        public_display_name: publicDisplayName.trim() || null,
      })
      .eq('id', user.id);

    if (error) { toast.error('Failed to save: ' + error.message); setSaving(false); return; }
    await refreshProfile();
    toast.success('Profile updated');
    setSaving(false);
  };

  const handleSavePrefs = () => {
    localStorage.setItem('edufund-notif-prefs', JSON.stringify({
      email: emailNotifications,
      digest: reminderDigest,
      campaign: campaignUpdates,
    }));
    toast.success('Notification preferences saved');
  };

  if (authLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-8 border-b border-border/60 pb-6">
        <div className="eyebrow mb-2">
          STUDENT ACCOUNT & VERIFICATION
        </div>
        <h1 className="display-md text-foreground">
          Settings & University Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-mono">
          Manage your matriculation details, Cowrywise savings preferences, and notification digests.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="privacy"><Shield className="mr-1.5 h-4 w-4" /> Privacy</TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle>Student profile</CardTitle>
              <CardDescription>This information is private. Only you can see it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" placeholder="University of Lagos" value={institution} onChange={(e) => setInstitution(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="course">Course / Programme</Label>
                  <Input id="course" placeholder="Computer Science" value={course} onChange={(e) => setCourse(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradYear">Graduation year (optional)</Label>
                  <Input id="gradYear" type="number" placeholder="2027" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (optional)</Label>
                <Input id="avatar" type="url" placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotif">Email notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive emails about your campaigns</p>
                </div>
                <Switch id="emailNotif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminderDigest">Pledge reminder digest</Label>
                  <p className="text-xs text-muted-foreground">Summary of upcoming pledge reminders</p>
                </div>
                <Switch id="reminderDigest" checked={reminderDigest} onCheckedChange={setReminderDigest} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="campaignUpdates">Campaign updates</Label>
                  <p className="text-xs text-muted-foreground">New contributions and pledge activity</p>
                </div>
                <Switch id="campaignUpdates" checked={campaignUpdates} onCheckedChange={setCampaignUpdates} />
              </div>
              <div className="rounded-lg bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
                <strong>Demo:</strong> Email delivery is not configured in this prototype. Preferences are saved locally.
              </div>
              <Button onClick={handleSavePrefs}><Save className="mr-2 h-4 w-4" /> Save preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle>Privacy & public display</CardTitle>
              <CardDescription>Control what appears on your public campaign pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publicName">Public display name</Label>
                <Input id="publicName" placeholder="First name + initial (e.g. Ada O.)" value={publicDisplayName} onChange={(e) => setPublicDisplayName(e.target.value)} />
                <p className="text-xs text-muted-foreground">This name appears on published campaigns. Use a name you&apos;re comfortable sharing publicly.</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <p className="font-medium">What is never shown publicly:</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Email address</li>
                  <li>• Phone number</li>
                  <li>• Student ID or BVN</li>
                  <li>• Private transactions</li>
                  <li>• Exact investment account balances</li>
                  <li>• Sponsor contact information</li>
                </ul>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save privacy settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
