export const WALL_SIZE = 1000;
export const TOTAL_PIXELS = WALL_SIZE ** 2;
export const STORAGE_KEY = 'mpa-next-demo-v1';
export const TIERS = Object.freeze({
  community: { name: 'Community', side: 25, price: 20, mode: 'buy', color: '#edf4d4', description: 'Your name, your project, your little corner of the internet.' },
  creator: { name: 'Creator', side: 50, price: 100, mode: 'buy', color: '#dce7ff', description: 'Four times the space for a project ready to be noticed.' },
  brand: { name: 'Brand', side: 100, price: 500, mode: 'auction', color: '#f7dae8', description: 'A big canvas. A featured auction. A place in the daily story.' },
});
export const money = n => new Intl.NumberFormat('en-AE', {style:'currency', currency:'AED', maximumFractionDigits:0}).format(n);
export function createLots() {
  const lots = [];
  for (let y=0;y<1000;y+=25) for (let x=0;x<500;x+=25) lots.push(lot(x,y,'community'));
  for (let y=0;y<1000;y+=50) for (let x=500;x<800;x+=50) lots.push(lot(x,y,'creator'));
  for (let y=0;y<1000;y+=100) for (let x=800;x<1000;x+=100) lots.push(lot(x,y,'brand'));
  return lots;
}
function lot(x,y,tier) { return {id:`${tier[0]}-${x}-${y}`, x,y,tier,side:TIERS[tier].side,status:tier==='brand'?'upcoming':'available',amount:TIERS[tier].price,bids:[],ad:null,owner:null,paidAt:null}; }
export function freshState() { return {version:1,lots:createLots(),user:null,campaignStart:null,events:[],reports:[],sequence:0}; }
export function stats(state) {
  const paid = state.lots.filter(l=>l.paidAt && l.owner && ['paid','published','review','hidden'].includes(l.status));
  const area = paid.reduce((a,l)=>a+l.side**2,0);
  return {paidPixels:area,percent:area/TOTAL_PIXELS*100,paidLots:paid.length,gross:paid.reduce((a,l)=>a+l.amount,0),bids:state.lots.reduce((a,l)=>a+l.bids.length,0)};
}
export function minimumBid(lot) { return lot.bids.length ? Math.max(lot.amount+1,Math.ceil(lot.amount*1.1)) : TIERS[lot.tier].price; }
export function safeUrl(value) {
  try { const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password && u.hostname.includes('.') ? u.href : null; } catch { return null; }
}
export function validateAd(ad) {
  if (!ad || typeof ad.title!=='string' || ad.title.trim().length<2 || ad.title.trim().length>40) throw new Error('Use a title between 2 and 40 characters.');
  if (typeof ad.description!=='string' || ad.description.length>160) throw new Error('Keep the description within 160 characters.');
  const url=safeUrl(ad.url);
  if (!url) throw new Error('Add a complete HTTPS website address.');
  if (typeof ad.color!=='string' || !/^#[0-9a-f]{6}$/i.test(ad.color)) throw new Error('Choose a valid background color.');
  if (ad.image && (typeof ad.image!=='string' || ad.image.length>190000 || !/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(ad.image))) throw new Error('Use a PNG, JPEG or WebP image under 140 KB after compression.');
  return {title:ad.title.trim(),description:ad.description.trim(),url,color:ad.color,image:ad.image||null};
}
function requireUser(s) { if (!s.user) throw new Error('Create a demo profile first.'); return s.user; }
function event(s,message,now) { s.events.unshift({id:++s.sequence,message,at:now}); s.events=s.events.slice(0,40); }
export function reserve(s,id,now=Date.now()) {
  const user=requireUser(s), l=s.lots.find(l=>l.id===id);
  if (!l || l.tier==='brand' || l.status!=='available') throw new Error('This block is not available for Buy Now.');
  if (s.lots.some(l=>l.status==='reserved'&&l.reservedBy===user.id&&l.deadline>now)) throw new Error('Finish or cancel your current checkout first.');
  l.status='reserved'; l.reservedBy=user.id; l.deadline=now+10*60*1000;
  return l;
}
export function cancelReservation(s,id) { const l=s.lots.find(l=>l.id===id); if(l?.status==='reserved'&&l.reservedBy===s.user?.id){l.status='available';delete l.reservedBy;delete l.deadline;} }
export function startAuction(s,id,now=Date.now()) {
  const l=s.lots.find(l=>l.id===id);
  if (!l || l.tier!=='brand' || l.status!=='upcoming') throw new Error('Choose an upcoming brand block.');
  if (s.lots.some(l=>l.status==='active'||l.status==='awaiting-payment')) throw new Error('Finish the current featured auction first.');
  l.status='active';l.startedAt=now;l.endsAt=now+48*60*60*1000;l.hardEndsAt=l.endsAt+10*60*1000;
  event(s,`Featured auction opened for ${l.id}.`,now);
  return l;
}
export function placeBid(s,id,amount,now=Date.now()) {
  const u=requireUser(s),l=s.lots.find(l=>l.id===id);
  if (!l || l.status!=='active' || now>=l.endsAt) throw new Error('This auction is closed.');
  if(l.bids.at(-1)?.uid===u.id) throw new Error('You are already the highest bidder.');
  if(s.lots.some(l=>l.status==='awaiting-payment'&&l.winner===u.id)) throw new Error('Complete your outstanding winning payment before bidding again.');
  if(!Number.isSafeInteger(amount)||amount<minimumBid(l)||amount>1000000) throw new Error(`Enter a whole-dirham bid of at least ${money(minimumBid(l))}, up to AED 1,000,000.`);
  l.amount=amount;l.bids.push({uid:u.id,name:u.name,amount,at:now});
  if(l.endsAt-now<=60000) l.endsAt=Math.min(l.hardEndsAt,now+60000);
  event(s,`${u.name} bid ${money(amount)} on ${id}.`,now);
  return l;
}
export function expire(s,now=Date.now()) {
  let changed=false;
  for(const l of s.lots) {
    if(l.status==='reserved' && now>=l.deadline) {l.status='available';delete l.reservedBy;delete l.deadline;changed=true;}
    if(l.status==='active' && now>=l.endsAt) {
      const winning=l.bids.at(-1);
      if(winning){l.status='awaiting-payment';l.winner=winning.uid;l.winnerName=winning.name;l.deadline=now+24*60*60*1000;event(s,`Auction ${l.id} ended. Winner payment is pending.`,now);}
      else {l.status='upcoming';event(s,`Auction ${l.id} ended without a bid.`,now);}
      changed=true;
    }
    if(l.status==='awaiting-payment'&&now>=l.deadline) {l.status='upcoming';l.winner=null;l.winnerName=null;l.bids=[];l.amount=TIERS.brand.price;delete l.deadline;event(s,`Unpaid block ${l.id} returned to the auction queue.`,now);changed=true;}
  }
  return changed;
}
// Preview simulator only. Production ownership must be fulfilled on a trusted server
// after verifying the provider's payment status, amount, currency and order identity.
export function simulatePayment(s,id,now=Date.now()) {
  const u=requireUser(s), l=s.lots.find(l=>l.id===id);
  if(!l || l.paidAt || now>=l.deadline || !((l.status==='reserved'&&l.reservedBy===u.id)||(l.status==='awaiting-payment'&&l.winner===u.id))) throw new Error('This checkout is no longer available to your profile.');
  l.owner=u.id;l.ownerName=u.name;l.paidAt=now;l.status='paid';delete l.reservedBy;delete l.deadline;
  if(!s.campaignStart)s.campaignStart=now;
  event(s,`${u.name} claimed ${l.side} × ${l.side} pixels. Demo payment confirmed.`,now);
  return l;
}
export function submitAd(s,id,ad,now=Date.now()) {const u=requireUser(s),l=s.lots.find(l=>l.id===id);if(!l||l.owner!==u.id||!l.paidAt)throw new Error('Only the paid owner can edit this block.');l.pendingAd=validateAd(ad);l.reviewBefore=l.status;l.status='review';event(s,`Ad for ${id} submitted for review.`,now);}
export function approveAd(s,id,now=Date.now()) {const l=s.lots.find(l=>l.id===id);if(!l||l.status!=='review'||!l.pendingAd)throw new Error('No submitted ad to review.');l.ad=l.pendingAd;delete l.pendingAd;l.status='published';event(s,`Ad for ${id} approved.`,now);}
export function rejectAd(s,id) {const l=s.lots.find(l=>l.id===id);if(!l||l.status!=='review')throw new Error('No submitted ad to review.');delete l.pendingAd;l.status=l.reviewBefore==='published'?'published':'paid';}
export function estimateRevenue(feePercent=2.9,fixedFee=1,refundPercent=5,hosting=0) {
  const lots=createLots(), gross=lots.reduce((a,l)=>a+TIERS[l.tier].price,0), processing=gross*feePercent/100+lots.length*fixedFee,refunds=gross*refundPercent/100;
  return {gross,processing,refunds,hosting,contribution:gross-processing-refunds-hosting,count:lots.length};
}

