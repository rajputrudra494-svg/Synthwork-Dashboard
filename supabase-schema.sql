-- ===============================================================================
-- Synthworks Dashboard - Supabase SQL Schema
-- ===============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================================================
-- 1. TABLES
-- ===============================================================================

-- WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    currency_code TEXT DEFAULT 'USD',
    currency_symbol TEXT DEFAULT '$',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'founder',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    contact TEXT,
    email TEXT,
    status TEXT CHECK (status IN ('prospect', 'active')),
    value INTEGER DEFAULT 0,
    projects INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('planning', 'active', 'on-hold', 'completed')),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget INTEGER DEFAULT 0,
    spent INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    tasks_done INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assignee_name TEXT,
    status TEXT CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('founder', 'admin', 'manager', 'employee', 'intern', 'viewer')),
    department TEXT,
    status TEXT CHECK (status IN ('active', 'away', 'offline')),
    tasks_done INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    projects INTEGER DEFAULT 0,
    hours NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    client_name TEXT,
    amount INTEGER NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('contract', 'proposal', 'report', 'other')),
    size TEXT,
    uploaded_by TEXT,
    version TEXT DEFAULT 'v1',
    storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    icon TEXT DEFAULT 'bell',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ===============================================================================
-- 2. INDEXES
-- ===============================================================================

CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_workspace ON public.profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_clients_workspace ON public.clients(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_team_members_workspace ON public.team_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_invoices_workspace ON public.invoices(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace ON public.documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notifications_workspace ON public.notifications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ===============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ===============================================================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current user's workspace_id
CREATE OR REPLACE FUNCTION public.get_user_workspace_id() 
RETURNS UUID AS $$
    SELECT workspace_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Workspaces Policies (Owners only)
CREATE POLICY "Users can view their own workspace" 
    ON public.workspaces FOR SELECT 
    USING (owner_id = auth.uid() OR id = public.get_user_workspace_id());

CREATE POLICY "Users can update their own workspace" 
    ON public.workspaces FOR UPDATE 
    USING (owner_id = auth.uid());

-- Profiles Policies
CREATE POLICY "Users can view profiles in their workspace" 
    ON public.profiles FOR SELECT 
    USING (workspace_id = public.get_user_workspace_id() OR id = auth.uid());

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (id = auth.uid());

-- General Policies for Workspace Data (Clients, Projects, Tasks, etc.)
-- Applies to clients, projects, tasks, team_members, invoices, documents, notifications

-- Clients
CREATE POLICY "Users can view clients in their workspace" ON public.clients FOR SELECT USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can insert clients in their workspace" ON public.clients FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update clients in their workspace" ON public.clients FOR UPDATE USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can delete clients in their workspace" ON public.clients FOR DELETE USING (workspace_id = public.get_user_workspace_id());

-- Projects
CREATE POLICY "Users can view projects in their workspace" ON public.projects FOR SELECT USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can insert projects in their workspace" ON public.projects FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update projects in their workspace" ON public.projects FOR UPDATE USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can delete projects in their workspace" ON public.projects FOR DELETE USING (workspace_id = public.get_user_workspace_id());

-- Tasks
CREATE POLICY "Users can view tasks in their workspace" ON public.tasks FOR SELECT USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can insert tasks in their workspace" ON public.tasks FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update tasks in their workspace" ON public.tasks FOR UPDATE USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can delete tasks in their workspace" ON public.tasks FOR DELETE USING (workspace_id = public.get_user_workspace_id());

-- Team Members
CREATE POLICY "Users can view team_members in their workspace" ON public.team_members FOR SELECT USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can insert team_members in their workspace" ON public.team_members FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update team_members in their workspace" ON public.team_members FOR UPDATE USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can delete team_members in their workspace" ON public.team_members FOR DELETE USING (workspace_id = public.get_user_workspace_id());

-- Invoices
CREATE POLICY "Users can view invoices in their workspace" ON public.invoices FOR SELECT USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can insert invoices in their workspace" ON public.invoices FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update invoices in their workspace" ON public.invoices FOR UPDATE USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can delete invoices in their workspace" ON public.invoices FOR DELETE USING (workspace_id = public.get_user_workspace_id());

-- Documents
CREATE POLICY "Users can view documents in their workspace" ON public.documents FOR SELECT USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can insert documents in their workspace" ON public.documents FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update documents in their workspace" ON public.documents FOR UPDATE USING (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can delete documents in their workspace" ON public.documents FOR DELETE USING (workspace_id = public.get_user_workspace_id());

-- Notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert notifications" ON public.notifications FOR INSERT WITH CHECK (workspace_id = public.get_user_workspace_id());
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their notifications" ON public.notifications FOR DELETE USING (user_id = auth.uid());

-- ===============================================================================
-- 4. TRIGGERS
-- ===============================================================================

-- Trigger to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_workspace_id UUID;
    workspace_name TEXT;
    user_full_name TEXT;
BEGIN
    -- Extract metadata with defaults
    workspace_name := COALESCE(NEW.raw_user_meta_data->>'workspace_name', 'My Workspace');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User');

    -- Create a new workspace for the user
    INSERT INTO public.workspaces (name, owner_id)
    VALUES (workspace_name, NEW.id)
    RETURNING id INTO new_workspace_id;

    -- Create a profile for the user
    INSERT INTO public.profiles (id, workspace_id, full_name, email, role)
    VALUES (NEW.id, new_workspace_id, user_full_name, NEW.email, 'founder');

    -- Add the user to the team_members table
    INSERT INTO public.team_members (workspace_id, profile_id, name, role, department, status)
    VALUES (new_workspace_id, NEW.id, user_full_name, 'founder', 'Leadership', 'active');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================================================
-- END OF SCHEMA
-- ===============================================================================
