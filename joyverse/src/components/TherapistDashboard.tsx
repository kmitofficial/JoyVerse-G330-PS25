import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PieChart, BarChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cell } from 'recharts';

// Types/interfaces
interface Session {
  sessionId: string;
  date: Date | string;
  assignedThemes: string[];
  themesChanged: string[];
  emotionsOfChild: string[];
  playedPuzzles: string[];
}

interface Child {
  username: string;
  joinedAt: string;
  sessions?: Session[];
  assignedThemes?: string[];
  currentAssignedThemes?: string[];
}

// Add ThemeTransition type
type ThemeTransition = {
  type: 'start' | 'transition';
  theme?: string;
  from?: string;
  to?: string;
  emotion: string;
  isSameTheme?: boolean;
};

const TherapistDashboard: React.FC = () => {
  const [therapistUsername, setTherapistUsername] = useState('');
  const [therapistCode, setTherapistCode] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [newChildUsername, setNewChildUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null); // Track the expanded session
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Apply background on mount
  useEffect(() => {
    document.body.style.backgroundImage = "url('/images/bg-6.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";

    const username = sessionStorage.getItem('therapistUsername');
    const code = sessionStorage.getItem('therapistCode');
    if (!username || !code) {
      navigate('/');
      return;
    }
    setTherapistUsername(username);
    setTherapistCode(code);
    fetchTherapistData(username);
  }, [navigate]);

  const fetchTherapistData = async (username: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/get-therapist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (response.ok) {
        setChildren(data.children || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch therapist data');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!newChildUsername.trim()) {
      setError('Enter a child username');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/add-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistCode: therapistCode,
          childName: newChildUsername
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTherapistData(therapistUsername);
        setNewChildUsername('');
        setError(null);
      } else {
        setError(data.message || 'Failed to add child');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error adding child:', err);
    }
  };
// Helper to prepare emotion data for chart
const prepareEmotionData = (session: Session) => {
  if (!session.emotionsOfChild || session.emotionsOfChild.length === 0) return [];
  
  const emotionCounts: {[key: string]: number} = {};
  
  session.emotionsOfChild.forEach(emotion => {
    const normalizedEmotion = emotion.toLowerCase();
    emotionCounts[normalizedEmotion] = (emotionCounts[normalizedEmotion] || 0) + 1;
  });
  
  return Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count
  }));
};


// Helper to prepare puzzle data for chart
const preparePuzzleData = (session: Session) => {
  if (!session.playedPuzzles || session.playedPuzzles.length === 0) return [];
  
  const puzzleCounts: {[key: string]: number} = {};
  
  session.playedPuzzles.forEach(puzzle => {
    puzzleCounts[puzzle] = (puzzleCounts[puzzle] || 0) + 1;
  });
  
  return Object.entries(puzzleCounts).map(([name, count]) => ({
    name,
    count
  }));
};
  const handleAssignThemes = (childUsername: string) => {
    sessionStorage.setItem('selectedChild', childUsername);
    sessionStorage.setItem('selectedChildTherapistCode', therapistCode);
    navigate('/theme-assignment');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleChildClick = (child: Child) => {
    setSelectedChild(selectedChild?.username === child.username ? null : child);
  };

  // Get emotion color for visual indication
  // const getEmotionColor = (emotion: string | undefined | null): string => {
  //   const emotionColors: { [key: string]: string } = {
  //     happy: '#4CAF50',
  //     sad: '#5C6BC0',
  //     angry: '#FF0000',
  //     scared: '#FF9800',
  //     neutral: '#9E9E9E',
  //     surprised: '#8E24AA',
  //     excited: '#FFD600',
  //     calm: '#03A9F4',
  //     unknown: '#9E9E9E',
  //   };
  //   if (typeof emotion !== 'string') {
  //     return emotionColors.unknown;
  //   }
  //   const normalizedEmotion = emotion.toLowerCase();
  //   for (const key in emotionColors) {
  //     if (normalizedEmotion.includes(key)) {
  //       return emotionColors[key];
  //     }
  //   }
  //   return emotionColors.unknown;
  // };
  const getEmotionColor = (emotion: string | undefined | null): string => {
    if (!emotion) return '#9E9E9E'; // Handle undefined/null
    
    const emotionColors: { [key: string]: string } = {
      happy: '#4CAF50',
      sad: '#5C6BC0',
      anger: '#FF0000',
      fear: '#FF9800',
      neutral: '#9E9E9E',
      surprised: '#8E24AA',
      excited: '#FFD600',
      calm: '#03A9F4',
      unknown: '#9E9E9E',
    };
  
    const normalizedEmotion = emotion.trim().toLowerCase();
    
    // Exact match first
    if (emotionColors[normalizedEmotion]) {
      return emotionColors[normalizedEmotion];
    }
  
    // Then check for partial matches
    const matchingKey = Object.keys(emotionColors).find(key => 
      normalizedEmotion.includes(key)
    );
  
    return matchingKey ? emotionColors[matchingKey] : emotionColors.unknown;
  };
  // Helper function to process theme transitions for display
  const processThemeTransitions = (session: Session): ThemeTransition[] => {
    if (!session.assignedThemes || session.assignedThemes.length === 0) {
      return [];
    }

    const firstTheme = session.assignedThemes[0];
    const results: ThemeTransition[] = [{
      type: 'start',
      theme: firstTheme,
      emotion: session.emotionsOfChild?.[0] || 'unknown'
    } as ThemeTransition];

    if (session.themesChanged && session.themesChanged.length > 0) {
      let currentTheme = firstTheme;

      for (let i = 0; i < session.themesChanged.length; i++) {
        const nextTheme = session.themesChanged[i];
        const emotion = i + 1 < session.emotionsOfChild.length
          ? session.emotionsOfChild[i + 1]
          : 'unknown';

        results.push({
          type: 'transition',
          from: currentTheme,
          to: nextTheme,
          emotion: emotion,
          isSameTheme: currentTheme === nextTheme
        } as ThemeTransition);

        currentTheme = nextTheme;
      }
    }
    return results;
  };

  // Format date for better display
  const formatSessionDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const preparePuzzleEmotionData = (session: Session, puzzle: string) => {
    const emotionCounts: {[key: string]: number} = {};
    
    session.playedPuzzles?.forEach((p, index) => {
      if (p === puzzle && session.emotionsOfChild?.[index]) {
        const emotion = session.emotionsOfChild[index];
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });
  
    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count
    }));
  };
  const toggleSession = (sessionId: string) => {
    setExpandedSessionId((prev) => (prev === sessionId ? null : sessionId)); // Toggle the session
  };
  const filteredChildren = children.filter((child) =>
    child.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;
  
  return (
    <Container>
      <Header>
        <Title>THERAPIST DASHBOARD</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
  
      <InfoSection>
        <InfoCard>
          <h3>Your Therapist Code</h3>
          <CodeDisplay>{therapistCode}</CodeDisplay>
          <small>Share this code with your children to let them join</small>
        </InfoCard>
      </InfoSection>
  
      <Section>
        <SectionHeader>
          <h2>Your Children</h2>
          <SearchInput
            type="text"
            placeholder="Search for a child..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SectionHeader>
  
        <AddChildSection>
          <InputGroup>
            <Input
              type="text"
              value={newChildUsername}
              onChange={(e) => setNewChildUsername(e.target.value)}
              placeholder="Enter child username"
            />
            <Button onClick={handleAddChild}>Add Child</Button>
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </AddChildSection>
  
        {filteredChildren.length === 0 ? (
          <EmptyState>No children found</EmptyState>
        ) : (
          <ChildrenGrid>
            {filteredChildren.map((child) => (
              <React.Fragment key={child.username}>
                <ChildCard 
                  onClick={() => handleChildClick(child)} 
                  isSelected={selectedChild?.username === child.username}
                >
                  <ChildCardHeader>
                    <h3>{child.username}</h3>
                    <SessionsCount>{child.sessions?.length || 0} Sessions</SessionsCount>
                  </ChildCardHeader>
                  <ChildCardContent>
                    <p>Joined: {new Date(child.joinedAt).toLocaleDateString()}</p>
                    <ThemesWrapper>
                      <p>Assigned Themes: </p>
                      <ThemesList>
                        {(child.currentAssignedThemes?.length || child.assignedThemes?.length) ? 
                          (child.currentAssignedThemes || child.assignedThemes)?.map((theme, idx) => (
                            <ThemeTag key={idx}>{theme}</ThemeTag>
                          ))
                          : <ThemeTag empty>None</ThemeTag>
                        }
                      </ThemesList>
                    </ThemesWrapper>
                  </ChildCardContent>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssignThemes(child.username);
                    }}
                  >
                    Assign Themes
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      navigate('/all-sessions-emotions', {
                        state: {
                          allSessions: child.sessions || [],
                        },
                      })
                    }
                    style={{ marginTop: '10px' }}
                  >
                    View All Sessions Emotions
                  </ActionButton>
                </ChildCard>
  
                {selectedChild?.username === child.username && (
                  <SessionsContainer>
                    <SessionsContainerHeader>
                      <h4>Sessions History</h4>
                      <SessionsCount>Total: {child.sessions?.length || 0}</SessionsCount>
                    </SessionsContainerHeader>
                    
                    {!child.sessions || child.sessions.length === 0 ? (
                      <EmptySessionsState>
                        <NoSessionsIcon>📊</NoSessionsIcon>
                        <p>No sessions recorded yet</p>
                      </EmptySessionsState>
                    ) : (
                      <SessionsList>
                        {child.sessions.map((session: Session) => {
                          const isExpanded = expandedSessionId === session.sessionId;
                          const themeTransitions = processThemeTransitions(session);
                          return (
                            <SessionCard key={session.sessionId}>
                              <SessionHeader>
                                <SessionDate>
                                  <CalendarIcon>📅</CalendarIcon>
                                  {formatSessionDate(session.date)}
                                </SessionDate>
                                <SessionStats>
                                  <StatBadge>
                                    <StatIcon>🧩</StatIcon>
                                    {session.playedPuzzles?.length || 0} Puzzles
                                  </StatBadge>
                                  <StatBadge>
                                    <StatIcon>🎭</StatIcon>
                                    {themeTransitions.length} Transitions
                                  </StatBadge>
                                </SessionStats>
                                <ToggleArrow onClick={() => toggleSession(session.sessionId)}>
                                  {isExpanded ? '▲' : '▼'}
                                </ToggleArrow>
                              </SessionHeader>
                              
                              {isExpanded && (
                                <SessionBody>
                                  <SessionSection>
                                    <SectionTitle>Themes</SectionTitle>
                                    <ThemeWrapper>
                                      {session.assignedThemes?.map((theme, idx) => (
                                        <ThemeTag key={idx}>{theme}</ThemeTag>
                                      )) || <p>None</p>}
                                    </ThemeWrapper>
                                  </SessionSection>
  
                                  {themeTransitions.length > 0 && (
                                    <SessionSection>
                                      <SectionTitle>Theme Journey</SectionTitle>
                                      <ThemeJourneyTimeline>
                                        {themeTransitions.map((transition, index) => {
                                          const emotionColor = getEmotionColor(transition.emotion);
                                          
                                          if (transition.type === 'start') {
                                            return (
                                              <TimelineItem key={`start-${index}`} isFirst={true}>
                                                <TimelineConnector isFirst={true} />
                                                <TimelineBubble color={emotionColor}>
                                                  <EmotionIndicator color={emotionColor} />
                                                </TimelineBubble>
                                                <TimelineContent>
                                                  <TimelineTitle>Started with: {transition.theme}</TimelineTitle>
                                                  <TimelineDetail>Emotion: {transition.emotion}</TimelineDetail>
                                                </TimelineContent>
                                              </TimelineItem>
                                            );
                                          } else {
                                            return (
                                              <TimelineItem key={`transition-${index}`}>
                                                <TimelineConnector />
                                                <TimelineBubble color={emotionColor}>
                                                  <EmotionIndicator color={emotionColor} />
                                                </TimelineBubble>
                                                <TimelineContent>
                                                  <TimelineTitle>
                                                    {transition.from}{' '}
                                                    {transition.isSameTheme ? 
                                                      <StayedIndicator>(stayed)</StayedIndicator> : 
                                                      <TransitionArrow>→</TransitionArrow>
                                                    }{' '}
                                                    {!transition.isSameTheme && transition.to}
                                                  </TimelineTitle>
                                                  <TimelineDetail>Emotion: {transition.emotion}</TimelineDetail>
                                                </TimelineContent>
                                              </TimelineItem>
                                            );
                                          }
                                        })}
                                      </ThemeJourneyTimeline>
                                    </SessionSection>
                                  )}
  
                                  {/* Emotion Distribution Pie Chart
                                  <SessionSection>
                                    <SectionTitle>Emotion Summary</SectionTitle>
                                    <ChartContainer>
                                      <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                          <Pie
                                            data={prepareEmotionData(session)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="emotion"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                          >
                                            {prepareEmotionData(session).map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={getEmotionColor(entry.emotion)} />
                                            ))}
                                          </Pie>
                                          <Tooltip 
                                            formatter={(value: number, name: string) => [
                                              value, 
                                              `${name}: ${((value as number / session.emotionsOfChild.length) * 100).toFixed(1)}%`
                                            ]}
                                          />
                                          <Legend />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </ChartContainer>
                                  </SessionSection> */}
                                  <SessionSection>
  <SectionTitle>Emotion Summary</SectionTitle>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px', // Adjust spacing between legend and chart
    justifyContent: 'center', // Center the whole group
  }}>
    {/* Pie Chart (Right Side) */}
    <div style={{ width: '60%', maxWidth: '300px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={prepareEmotionData(session)}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="emotion"
            label={false} // Hide labels on slices
          >
            {prepareEmotionData(session).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getEmotionColor(entry.emotion)} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [
              value, 
              `${name}: ${((value / session.emotionsOfChild.length) * 100).toFixed(1)}%`
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Emotion Legend (Left Side, Close to Chart) */}
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      paddingLeft: '16px', // Space between chart and legend
    }}>
      {prepareEmotionData(session).map((entry, index) => (
        <div key={`legend-${index}`} style={{ 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '14px',
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: getEmotionColor(entry.emotion),
            marginRight: '8px',
            borderRadius: '2px',
          }} />
          <span>
            {entry.emotion}: <strong>{((entry.count / session.emotionsOfChild.length) * 100).toFixed(0)}%</strong>
          </span>
        </div>
      ))}
    </div>
  </div>
</SessionSection>
  
                              
  
                                  {/* Puzzles Played Bar Chart */}
                                  {session.playedPuzzles && session.playedPuzzles.length > 0 && (
                                    <SessionSection>
                                      <SectionTitle>Puzzles Played</SectionTitle>
                                      <div>{session.playedPuzzles.length || 0}</div>
                                    </SessionSection>
                                  )}
                                </SessionBody>
                              )}
                            </SessionCard>
                          );
                        })}
                      </SessionsList>
                    )}
                  </SessionsContainer>
                )}
              </React.Fragment>
            ))}
          </ChildrenGrid>
        )}
      </Section>
    </Container>
  );
  
};

// Styled Components
const Container = styled.div`
  padding: 20px; 
  max-width: 1200px; 
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333; 
  margin: 0;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
`;

const LogoutButton = styled.button`
  padding: 8px 16px; 
  background-color: #ff4444; 
  color: white;
  border: none; 
  border-radius: 4px; 
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { 
    background-color: #cc0000; 
    transform: translateY(-2px);
  }
`;

const InfoSection = styled.div`
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px; 
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
`;

const CodeDisplay = styled.div`
  font-size: 28px; 
  font-weight: bold; 
  color: #5a7af0; 
  margin: 15px 0;
  letter-spacing: 1px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionHeader = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-weight: 800;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  }
`;

const AddChildSection = styled.div`
  margin-bottom: 25px;
`;

const InputGroup = styled.div`
  display: flex; 
  gap: 10px; 
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 12px 15px; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  flex: 1;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #5a7af0;
    box-shadow: 0 0 0 2px rgba(90, 122, 240, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 20px; 
  background-color: #5a7af0;
  color: white; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover { 
    background-color: #4a67cc; 
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(90, 122, 240, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c; 
  background: #fdeaea; 
  padding: 0.8rem;
  border-radius: 8px; 
  text-align: center;
  border-left: 4px solid #e74c3c;
`;

const EmptyState = styled.div`
  text-align: center; 
  padding: 40px; 
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px; 
  color: #666;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ChildrenGrid = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const ChildCard = styled.div<{ isSelected?: boolean }>`
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px; 
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: ${props => props.isSelected ? '5px solid #5a7af0' : '5px solid transparent'};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  
  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: ${props => props.isSelected ? '#5a7af0' : 'transparent'};
    transition: all 0.3s ease;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    opacity: 0.1;
  }
`;

const ChildCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    font-weight: 700;
  }
`;

const ChildCardContent = styled.div`
  p {
    margin: 8px 0;
    color: #555;
    font-size: 14px;
  }
`;

const ThemesWrapper = styled.div`
  margin-top: 12px;
  
  p {
    margin-bottom: 8px;
    font-weight: 600;
  }
`;

const ThemesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ThemeTag = styled.span<{ empty?: boolean }>`
  background-color: ${props => props.empty ? '#f0f0f0' : '#e9efff'};
  color: ${props => props.empty ? '#999' : '#5a7af0'};
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
`;

const ThemeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const SessionsCount = styled.span`
  background-color: #f0f4ff;
  color: #5a7af0;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
`;

const ActionButton = styled.button`
  padding: 10px 16px; 
  background-color: #6e8efb; 
  color: white;
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  margin-top: 15px; 
  width: 100%;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover { 
    background-color: #5a7af0;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(90, 122, 240, 0.3);
  }
`;

const SessionsContainer = styled.div`
  grid-column: 1 / -1;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  margin-top: -10px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
`;

const SessionsContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  
  h4 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
`;

const EmptySessionsState = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  p {
    margin-top: 10px;
    font-size: 16px;
  }
`;

const NoSessionsIcon = styled.div`
  font-size: 36px;
  margin-bottom: 10px;
`;

const SessionsList = styled.div`
  display: grid;
  gap: 20px;
`;

const SessionCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const SessionHeader = styled.div`
  background-color: #f7f9ff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eef2ff;
`;

const SessionDate = styled.div`
  display: flex;
  align-items: center;
  color: #5a7af0;
  font-weight: 600;
  font-size: 14px;
`;

const CalendarIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

const SessionStats = styled.div`
  display: flex;
  gap: 12px;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  background-color: #e9efff;
  color: #5a7af0;
  padding: 5px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
`;

const StatIcon = styled.span`
  margin-right: 4px;
  font-size: 14px;
`;

const SessionBody = styled.div`
  padding: 20px;
`;

const SessionSection = styled.div`
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h5`
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  
  &:after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background-color: #eee;
    margin-left: 10px;
  }
`;

const ThemeJourneyTimeline = styled.div`
  position: relative;
  margin-left: 10px;
`;

const TimelineItem = styled.div<{ isFirst?: boolean }>`
  position: relative;
  padding-left: 30px;
  padding-bottom: ${props => props.isFirst ? '25px' : '20px'};
  
  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineConnector = styled.div<{ isFirst?: boolean }>`
  position: absolute;
  left: 10px;
  top: ${props => props.isFirst ? '28px' : '0'};
  bottom: 0;
  width: 2px;
  background-color: #eef2ff;
`;

const TimelineBubble = styled.div<{ color: string }>`
  position: absolute;
  left: 0;
  top: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const EmotionIndicator = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const TimelineContent = styled.div`
  background-color: #f7f9ff;
  border-radius: 8px;
  padding: 12px 15px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

const TimelineDetail = styled.div`
  color: #666;
  font-size: 13px;
  margin-top: 6px;
`;

const StayedIndicator = styled.span`
  color: #888;
  font-size: 12px;
  font-weight: normal;
`;

const TransitionArrow = styled.span`
  color: #5a7af0;
  font-weight: bold;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #5a7af0;
`;

const ErrorContainer = styled.div`
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fdeaea;
  border-left: 4px solid #e74c3c;
  border-radius: 8px;
  color: #e74c3c;
`;
const ChartContainer = styled.div`
  margin-top: 20px;
  height: 250px;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h6`
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  text-align: center;
`;
const PuzzlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
`;

const PuzzleChartContainer = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const PuzzleTitle = styled.h5`
  margin: 0 0 10px 0;
  text-align: center;
  color: #333;
`;
const ToggleArrow = styled.div`
  cursor: pointer;
  font-size: 18px;
  color: #5a7af0;
  margin-left: 10px;
  &:hover {
    color: #4a67cc;
  }
`;
const SearchBarContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #5a7af0;
    box-shadow: 0 0 0 2px rgba(90, 122, 240, 0.2);
  }
`;
export default TherapistDashboard;